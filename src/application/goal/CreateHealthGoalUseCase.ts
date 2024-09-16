import {
  HealthGoal,
  HealthGoalStatus,
  IBloodPressureValue,
} from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { NotificationType } from '../../domain/notification/Notification'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { INotificationHelper } from '../notification/NotificationHelper'

interface CreateHealthGoalRequest {
  user: User
}

interface CreateHealthGoalResponse {
  id: string
  bloodPressureTargetValue: IBloodPressureValue
  bloodSugarTargetValue: number
  bloodSugarTargetType: BloodSugarType
  glycatedHemoglobinTargetValue: number
  weightTargetValue: number
  bodyMassIndexTargetValue: number
  startAt: Date
  endAt: Date
  status: HealthGoalStatus
  createdAt: Date
  updatedAt: Date
}

enum StatusAfterCheck {
  ABNORMAL = 'ABNORMAL',
  EMERGENCY = 'EMERGENCY',
  NORMAL = 'NORMAL',
  INVALID = 'INVALID',
}

export class CreateHealthGoalUseCase {
  constructor(
    private readonly healthGoalRepository: IHealthGoalRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly glycatedHemoglobinRecordRepository: IGlycatedHemoglobinRecordRepository,
    private readonly weightRecordRepository: IWeightRecordRepository,
    private readonly uuidService: IUuidService,
    private readonly notifictionHelper: INotificationHelper
  ) {}

  public async execute(
    request: CreateHealthGoalRequest
  ): Promise<CreateHealthGoalResponse | null> {
    const { user } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      return null
    }

    const heightRounded =
      Math.round((existingPatient.heightValueCm / 100) * 100) / 100

    const patientTargetWeight =
      Math.round(Math.pow(heightRounded, 2) * 22.5 * 100) / 100

    const exsitingHealthGoals =
      await this.healthGoalRepository.findByPatientIdAndStatus(
        existingPatient.id,
        [HealthGoalStatus.IN_PROGRESS, HealthGoalStatus.PENDING]
      )

    if (exsitingHealthGoals.length !== 0) {
      return null
    }

    const latestRejectedHealthGoal =
      await this.healthGoalRepository.findByPatientIdAndStatus(
        existingPatient.id,
        [HealthGoalStatus.REJECTED]
      )

    if (latestRejectedHealthGoal.length !== 0) {
      const createdAtDate = latestRejectedHealthGoal[0].createdAt

      const fourteenDaysLater = new Date(createdAtDate.getTime())
      fourteenDaysLater.setDate(fourteenDaysLater.getDate() + 14)
      if (createdAtDate.getDate() + 1 < fourteenDaysLater.getDate()) {
        return null
      }
    }

    const daysAgo = 14
    const hospitalCheckDaysAgo = 45

    const checkedBloodPressureRecord = await this.isBloodPressureAbnormal(
      existingPatient.id,
      daysAgo
    )
    if (
      checkedBloodPressureRecord.status === StatusAfterCheck.EMERGENCY ||
      checkedBloodPressureRecord.status === StatusAfterCheck.INVALID
    ) {
      return null
    }

    /**
     *
     */
    const checkedBloodSugarRecord = await this.isBloodSugarAbnormal(
      existingPatient.id,
      daysAgo
    )
    if (
      checkedBloodSugarRecord.status === StatusAfterCheck.EMERGENCY ||
      checkedBloodSugarRecord.status === StatusAfterCheck.INVALID
    ) {
      return null
    }

    const checkedGlycatedHemoglobinRecord =
      await this.isGlycatedHemoglobinAbnormal(
        existingPatient.id,
        hospitalCheckDaysAgo
      )
    if (
      checkedGlycatedHemoglobinRecord.status === StatusAfterCheck.EMERGENCY ||
      checkedGlycatedHemoglobinRecord.status === StatusAfterCheck.INVALID
    ) {
      return null
    }

    const checkedWeightRecord = await this.isBodyMassIndexAbnormal(
      existingPatient.id,
      daysAgo
    )
    if (
      checkedWeightRecord.status === StatusAfterCheck.EMERGENCY ||
      checkedWeightRecord.status === StatusAfterCheck.INVALID
    ) {
      return null
    }

    const bloodSugarRelatedStatus =
      checkedBloodSugarRecord.status === StatusAfterCheck.ABNORMAL ||
      checkedGlycatedHemoglobinRecord.status === StatusAfterCheck.ABNORMAL
        ? StatusAfterCheck.ABNORMAL
        : StatusAfterCheck.NORMAL

    if (
      this.allRecordsAreNormal([
        checkedBloodPressureRecord.status,
        bloodSugarRelatedStatus,
        checkedWeightRecord.status,
      ])
    ) {
      return null
    }

    const healthGoal = new HealthGoal({
      id: this.uuidService.generateUuid(),
      bloodPressureTargetValue: {
        systolicBloodPressure: 120,
        diastolicBloodPressure: 80,
      },
      bloodSugarTargetValue: 100,
      bloodSugarTargetType: BloodSugarType.FAST_PLASMA_GLUCOSE,
      glycatedHemoglobinTargetValue: 5,
      weightTargetValue: patientTargetWeight,
      bodyMassIndexTargetValue: 22.5,
      startAt: new Date(),
      endAt: new Date(),
      status: HealthGoalStatus.PENDING,
      result: {
        bloodPressureGoalAchieved: false,
        bloodSugarGoalAchieved: false,
        glycatedHemoglobinGoalAchieved: false,
        weightGoalAchieved: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
      doctorId: null,
    })
    await this.healthGoalRepository.save(healthGoal)

    await this.notifictionHelper.createNotification({
      title: 'Hi, here is a health goal for you!',
      content:
        "You're doing great! You have recorded your health data for 14 consecutive days. We have noticed some values in your records that deviate from the standard range.Goog",
      notificationType: NotificationType.HEALTH_GOAL_NOTIFICATION,
      referenceId: healthGoal.id,
      user: existingPatient.user,
    })

    return {
      id: healthGoal.id,
      bloodPressureTargetValue: healthGoal.bloodPressureTargetValue,
      bloodSugarTargetValue: healthGoal.bloodSugarTargetValue,
      bloodSugarTargetType: healthGoal.bloodSugarTargetType,
      glycatedHemoglobinTargetValue: healthGoal.glycatedHemoglobinTargetValue,
      weightTargetValue: healthGoal.weightTargetValue,
      bodyMassIndexTargetValue: healthGoal.bodyMassIndexTargetValue,
      startAt: new Date(),
      endAt: new Date(),
      status: healthGoal.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  private allRecordsAreNormal(recordsStatus: StatusAfterCheck[]): boolean {
    for (const recordStatus of recordsStatus) {
      if (recordStatus !== StatusAfterCheck.NORMAL) {
        return false
      }
    }
    return true
  }

  private async isBloodPressureAbnormal(
    patientId: string,
    daysAgo: number
  ): Promise<{
    status: StatusAfterCheck
    targetValue: {
      systolicBloodPressure: number
      diastolicBloodPressure: number
    }
  }> {
    const pastBloodPressureRecords =
      await this.bloodPressureRecordRepository.bloodPressureCountByPatientId(
        patientId,
        daysAgo
      )

    if (pastBloodPressureRecords.length !== 14) {
      return {
        status: StatusAfterCheck.INVALID,
        targetValue: {
          systolicBloodPressure: 0,
          diastolicBloodPressure: 0,
        },
      }
    }

    let sumSystolicBloodPressure = 0
    let sumDiastolicBloodPressure = 0

    for (const bloodPressureRawCounts of pastBloodPressureRecords) {
      sumSystolicBloodPressure += bloodPressureRawCounts.systolic_blood_pressure
      sumDiastolicBloodPressure +=
        bloodPressureRawCounts.diastolic_blood_pressure
    }

    const avgSystolicBloodPressure = Math.round(sumSystolicBloodPressure / 14)
    const avgDiastolicBloodPressure = Math.round(sumDiastolicBloodPressure / 14)

    if (
      avgSystolicBloodPressure >= 140 ||
      avgDiastolicBloodPressure >= 90 ||
      avgSystolicBloodPressure < 90 ||
      avgDiastolicBloodPressure < 60
    ) {
      console.log('EMERGENCY')
      return {
        status: StatusAfterCheck.EMERGENCY,
        targetValue: {
          systolicBloodPressure: 0,
          diastolicBloodPressure: 0,
        },
      }
    }

    if (
      (avgSystolicBloodPressure > 120 && avgSystolicBloodPressure <= 139) ||
      (avgDiastolicBloodPressure > 80 && avgDiastolicBloodPressure <= 89)
    ) {
      return {
        status: StatusAfterCheck.ABNORMAL,
        targetValue: {
          systolicBloodPressure: 120,
          diastolicBloodPressure: 80,
        },
      }
    }

    console.log('normal')
    return {
      status: StatusAfterCheck.NORMAL,
      targetValue: {
        systolicBloodPressure: 0,
        diastolicBloodPressure: 0,
      },
    }
  }

  private async isBloodSugarAbnormal(
    patientId: string,
    daysAgo: number
  ): Promise<{
    status: StatusAfterCheck
    targetValue: {
      bloodSugarValue: number
      bloodSugarType: BloodSugarType
    }
  }> {
    const pastBloodSugarRecords =
      await this.bloodSugarRecordRepository.bloodSugarCountByPatientId(
        patientId,
        daysAgo
      )

    if (pastBloodSugarRecords.length !== 14) {
      return {
        status: StatusAfterCheck.INVALID,
        targetValue: {
          bloodSugarValue: 80,
          bloodSugarType: BloodSugarType.FAST_PLASMA_GLUCOSE,
        },
      }
    }

    let sumBloodSugarValue = 0

    for (const bloodSugarRawCounts of pastBloodSugarRecords) {
      sumBloodSugarValue += bloodSugarRawCounts.blood_sugar_value
    }

    const avgBloodSugarValue = Math.round(sumBloodSugarValue / 14)

    if (avgBloodSugarValue >= 126 || avgBloodSugarValue < 70) {
      console.log('EMERGENCY')
      return {
        status: StatusAfterCheck.EMERGENCY,
        targetValue: {
          bloodSugarValue: 0,
          bloodSugarType: BloodSugarType.FAST_PLASMA_GLUCOSE,
        },
      }
    }

    if (avgBloodSugarValue >= 100 && avgBloodSugarValue <= 125) {
      return {
        status: StatusAfterCheck.ABNORMAL,
        targetValue: {
          bloodSugarValue: 80,
          bloodSugarType: BloodSugarType.FAST_PLASMA_GLUCOSE,
        },
      }
    }

    console.log('normal')
    return {
      status: StatusAfterCheck.NORMAL,
      targetValue: {
        bloodSugarValue: 0,
        bloodSugarType: BloodSugarType.FAST_PLASMA_GLUCOSE,
      },
    }
  }

  private async isBodyMassIndexAbnormal(
    patientId: string,
    daysAgo: number
  ): Promise<{
    status: StatusAfterCheck
    targetValue: {
      weightValueKg: number
      bodyMassIndexValue: number
    }
  }> {
    const pastWeightRecords =
      await this.weightRecordRepository.weightCountByPatientId(
        patientId,
        daysAgo
      )

    if (pastWeightRecords.length !== 14) {
      return {
        status: StatusAfterCheck.INVALID,
        targetValue: {
          weightValueKg: 0,
          bodyMassIndexValue: 0,
        },
      }
    }

    let sumBodyMassIndexValue = 0

    for (const weightRawCounts of pastWeightRecords) {
      sumBodyMassIndexValue += weightRawCounts.body_mass_index
    }

    const avgBodyMassIndexValue = Math.round(sumBodyMassIndexValue / 14)

    if (avgBodyMassIndexValue >= 27 || avgBodyMassIndexValue < 16) {
      console.log('EMERGENCY')
      return {
        status: StatusAfterCheck.EMERGENCY,
        targetValue: {
          weightValueKg: 0,
          bodyMassIndexValue: 0,
        },
      }
    }

    if (
      (avgBodyMassIndexValue >= 24 && avgBodyMassIndexValue < 27) ||
      (avgBodyMassIndexValue >= 16 && avgBodyMassIndexValue < 18.5)
    ) {
      return {
        status: StatusAfterCheck.ABNORMAL,
        targetValue: {
          weightValueKg: 50,
          bodyMassIndexValue: 22,
        },
      }
    }

    console.log('normal')
    return {
      status: StatusAfterCheck.NORMAL,
      targetValue: {
        weightValueKg: 0,
        bodyMassIndexValue: 0,
      },
    }
  }

  private async isGlycatedHemoglobinAbnormal(
    patientId: string,
    hospitalCheckDaysAgo: number
  ): Promise<{
    status: StatusAfterCheck
    targetValue: {
      glycatedHemoglobinValuePercent: number
    }
  }> {
    const pastGlycatedHemoglobinRecord =
      await this.glycatedHemoglobinRecordRepository.findByPatientId(
        patientId,
        hospitalCheckDaysAgo
      )

    if (pastGlycatedHemoglobinRecord.length === 0) {
      return {
        status: StatusAfterCheck.INVALID,
        targetValue: {
          glycatedHemoglobinValuePercent: 0,
        },
      }
    }

    const hasGlycatedHemoglobinEmergency = pastGlycatedHemoglobinRecord.some(
      (record) => {
        const roundedValue =
          Math.round(record.glycated_hemoglobin_value_percent * 10) / 10
        const truncatedValue = Number(roundedValue.toFixed(1))
        return truncatedValue >= 6.5
      }
    )

    if (hasGlycatedHemoglobinEmergency) {
      console.log('EMERGENCY')
      return {
        status: StatusAfterCheck.EMERGENCY,
        targetValue: {
          glycatedHemoglobinValuePercent: 0,
        },
      }
    }

    const hasGlycatedHemoglobinAbnormal = pastGlycatedHemoglobinRecord.some(
      (record) => {
        const roundedValue =
          Math.round(record.glycated_hemoglobin_value_percent * 10) / 10
        const truncatedValue = Number(roundedValue.toFixed(1))
        return truncatedValue >= 5.7 && truncatedValue <= 6.4
      }
    )

    if (hasGlycatedHemoglobinAbnormal) {
      return {
        status: StatusAfterCheck.ABNORMAL,
        targetValue: {
          glycatedHemoglobinValuePercent: 5,
        },
      }
    }

    console.log('normal')
    return {
      status: StatusAfterCheck.NORMAL,
      targetValue: {
        glycatedHemoglobinValuePercent: 0,
      },
    }
  }
}
