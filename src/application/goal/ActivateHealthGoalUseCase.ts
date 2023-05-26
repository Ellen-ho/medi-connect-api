import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import {
  HealthGoal,
  HealthGoalStatus,
  IBloodPressureValue,
} from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
// import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface ActivateHealthGoalRequest {
  healthGoalId: string
  user: User
}

interface ActivateHealthGoalResponse {
  id: string
  bloodPressureTargetValue: IBloodPressureValue
  bloodSugarTargetValue: number
  bloodSugarTargetType: BloodSugarType
  glycatedHemonglobinTargetValue: number
  weightTargetValue: number
  bodyMassIndexTargetValue: number
  startAt: Date
  endAt: Date
  status: HealthGoalStatus
  createdAt: Date
  updatedAt: Date
}

export class ActivateHealthGoalUseCase {
  constructor(
    private readonly healthGoalRepository: IHealthGoalRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly weightRecordRepository: IWeightRecordRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: ActivateHealthGoalRequest
  ): Promise<ActivateHealthGoalResponse | null> {
    /**
     * 1. Check if the health goal exists
     * 2. Check if the health goal is for the user
     * 3. Activate the health goal
     * 4. Return the health goal
     */
    const { user } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const exsitingHealthGoal =
      await this.healthGoalRepository.countsByPatientId(existingPatient.id)

    if (exsitingHealthGoal !== 0) {
      return null
    }

    const daysAgo = 14

    // Check all records
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

    // all records are NORMAL, no need to create new health goal
    if (
      this.allRecordsAreNormal([
        checkedBloodPressureRecord.status,
        checkedBloodSugarRecord.status,
        checkedWeightRecord.status,
      ])
    ) {
      return null
    }

    // if some of the records are ABNORMAL, create new health goal
    const healthGoal = new HealthGoal({
      id: this.uuidService.generateUuid(),
      bloodPressureTargetValue: {
        systolicBloodPressure: 120,
        diastolicBloodPressure: 80,
      },
      bloodSugarTargetValue: 100,
      bloodSugarTargetType: BloodSugarType.FAST_PLASMA_GLUCOSE,
      glycatedHemonglobinTargetValue: 5,
      weightTargetValue: 50,
      bodyMassIndexTargetValue: 22,
      startAt: new Date(),
      endAt: new Date(),
      status: HealthGoalStatus.PARTIAL_GOALS_ACHIEVED,
      result: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
      doctorId: existingDoctor.id,
    })
    await this.healthGoalRepository.save(healthGoal)

    return {
      id: healthGoal.id,
      bloodPressureTargetValue: healthGoal.bloodPressureTargetValue,
      bloodSugarTargetValue: healthGoal.bloodSugarTargetValue,
      bloodSugarTargetType: healthGoal.bloodSugarTargetType,
      glycatedHemonglobinTargetValue: healthGoal.glycatedHemonglobinTargetValue,
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

    // abnormal but not emergency, set goal
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
    } else if (
      avgSystolicBloodPressure >= 140 &&
      avgSystolicBloodPressure >= 90
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

    // abnormal but not emergency, set goal
    if (avgBloodSugarValue >= 100 && avgBloodSugarValue <= 125) {
      return {
        status: StatusAfterCheck.ABNORMAL,
        targetValue: {
          bloodSugarValue: 80,
          bloodSugarType: BloodSugarType.FAST_PLASMA_GLUCOSE,
        },
      }
    } else if (avgBloodSugarValue >= 126) {
      console.log('EMERGENCY')
      return {
        status: StatusAfterCheck.EMERGENCY,
        targetValue: {
          bloodSugarValue: 0,
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
      weightValue: number
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
          weightValue: 0,
          bodyMassIndexValue: 0,
        },
      }
    }

    let sumBodyMassIndexValue = 0

    for (const weightRawCounts of pastWeightRecords) {
      sumBodyMassIndexValue += weightRawCounts.body_mass_index
    }

    const avgBodyMassIndexValue = Math.round(sumBodyMassIndexValue / 14)

    // abnormal but not emergency, set goal
    if (avgBodyMassIndexValue >= 24 && avgBodyMassIndexValue < 27) {
      return {
        status: StatusAfterCheck.ABNORMAL,
        targetValue: {
          weightValue: 50,
          bodyMassIndexValue: 22,
        },
      }
    } else if (avgBodyMassIndexValue >= 27) {
      console.log('EMERGENCY')
      return {
        status: StatusAfterCheck.EMERGENCY,
        targetValue: {
          weightValue: 0,
          bodyMassIndexValue: 0,
        },
      }
    }

    console.log('normal')
    return {
      status: StatusAfterCheck.NORMAL,
      targetValue: {
        weightValue: 0,
        bodyMassIndexValue: 0,
      },
    }
  }
}
