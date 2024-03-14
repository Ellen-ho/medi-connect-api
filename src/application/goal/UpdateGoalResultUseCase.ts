import {
  HealthGoalStatus,
  IBloodPressureValue,
  IHealthGoalResult,
} from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface UpdateGoalResultRequest {
  healthGoalId: string
}

interface UpdateGoalResultResponse {
  id: string
  bloodPressureCurrentValue: IBloodPressureValue | null
  bloodPressureTargetValue: IBloodPressureValue
  bloodSugarCurrentValue: number | null
  bloodSugarCurrentType: BloodSugarType | null
  bloodSugarTargetValue: number
  bloodSugarTargetType: BloodSugarType
  glycatedHemoglobinCurrentValue: number | null
  glycatedHemoglobinTargetValue: number
  weightCurrentValue: number | null
  weightTargetValue: number
  bodyMassIndexCurrentValue: number | null
  bodyMassIndexTargetValue: number
  startAt: Date
  endAt: Date
  status: HealthGoalStatus
  result: IHealthGoalResult
  createdAt: Date
  updatedAt: Date
}

export class UpdateGoalResultUseCase {
  constructor(
    private readonly healthGoalRepository: IHealthGoalRepository,
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly weightRecordRepository: IWeightRecordRepository,
    private readonly glycatedHemoglobinRecordRepository: IGlycatedHemoglobinRecordRepository
  ) {}

  public async execute(
    request: UpdateGoalResultRequest
  ): Promise<UpdateGoalResultResponse> {
    const { healthGoalId } = request

    const existingHealthGoal = await this.healthGoalRepository.findById(
      healthGoalId
    )

    if (existingHealthGoal === null) {
      throw new NotFoundError('HealthGoal does not exist.')
    }

    const bloodPressureGoalDurationValue =
      await this.bloodPressureRecordRepository.findByGoalDurationDays(
        existingHealthGoal.patientId,
        existingHealthGoal.startAt,
        existingHealthGoal.endAt
      )
    if (bloodPressureGoalDurationValue.length === 0) {
      existingHealthGoal.updateBloodPressureGoalResult(false)
      existingHealthGoal.updateGoalStatus(HealthGoalStatus.GOAL_FAILED)
      await this.healthGoalRepository.save(existingHealthGoal)
    }

    const previousDate = new Date(existingHealthGoal.endAt)
    previousDate.setDate(previousDate.getDate() - 1)
    const hospitalCheckDaysAgo = 45
    const glycatedHemoglobinDateEdge = new Date(existingHealthGoal.endAt)
    glycatedHemoglobinDateEdge.setDate(
      glycatedHemoglobinDateEdge.getDate() - hospitalCheckDaysAgo
    )

    const latestBloodPressureRecord =
      await this.bloodPressureRecordRepository.findByPatientIdAndDate(
        existingHealthGoal.patientId,
        previousDate
      )
    if (latestBloodPressureRecord == null) {
      existingHealthGoal.updateBloodPressureGoalResult(false)
      existingHealthGoal.updateGoalStatus(HealthGoalStatus.GOAL_FAILED)
      await this.healthGoalRepository.save(existingHealthGoal)
    }

    const latestBloodSugarRecord =
      await this.bloodSugarRecordRepository.findByPatientIdAndDate(
        existingHealthGoal.patientId,
        previousDate
      )
    if (latestBloodSugarRecord == null) {
      existingHealthGoal.updateBloodSugarGoalResult(false)
      existingHealthGoal.updateGoalStatus(HealthGoalStatus.GOAL_FAILED)
      await this.healthGoalRepository.save(existingHealthGoal)
    }

    const latestWeightRecord =
      await this.weightRecordRepository.findByPatientIdAndDate(
        existingHealthGoal.patientId,
        previousDate
      )

    if (latestWeightRecord == null) {
      existingHealthGoal.updateWeightGoalResult(false)
      existingHealthGoal.updateGoalStatus(HealthGoalStatus.GOAL_FAILED)
      await this.healthGoalRepository.save(existingHealthGoal)
    }

    const glycatedHemoglobinRecords =
      await this.glycatedHemoglobinRecordRepository.findByPatientIdAndDateRange(
        existingHealthGoal.patientId,
        glycatedHemoglobinDateEdge,
        previousDate
      )

    if (glycatedHemoglobinRecords.length > 0) {
      glycatedHemoglobinRecords.sort(
        (a, b) =>
          new Date(b.glycatedHemoglobinDate).getTime() -
          new Date(a.glycatedHemoglobinDate).getTime()
      )
    }

    const latestGlycatedHemoglobinValue =
      glycatedHemoglobinRecords.length > 0
        ? glycatedHemoglobinRecords[0].glycatedHemoglobinValuePercent
        : null

    if (latestGlycatedHemoglobinValue == null) {
      existingHealthGoal.updateGlycatedHemoglobinGoalResult(false)
      existingHealthGoal.updateGoalStatus(HealthGoalStatus.GOAL_FAILED)
      await this.healthGoalRepository.save(existingHealthGoal)
    }

    if (
      latestBloodPressureRecord !== null &&
      latestBloodPressureRecord.systolicBloodPressure <= 120 &&
      latestBloodPressureRecord.diastolicBloodPressure <= 80 &&
      latestBloodSugarRecord !== null &&
      latestBloodSugarRecord.bloodSugarValue < 100 &&
      latestWeightRecord !== null &&
      latestWeightRecord.bodyMassIndex >= 18.5 &&
      latestWeightRecord.bodyMassIndex < 24 &&
      latestGlycatedHemoglobinValue !== null &&
      latestGlycatedHemoglobinValue <= 5.7
    ) {
      existingHealthGoal.updateBloodPressureGoalResult(true)
      existingHealthGoal.updateBloodSugarGoalResult(true)
      existingHealthGoal.updateGlycatedHemoglobinGoalResult(true)
      existingHealthGoal.updateWeightGoalResult(true)
      existingHealthGoal.updateGoalStatus(HealthGoalStatus.ALL_GOALS_ACHIEVED)
      await this.healthGoalRepository.save(existingHealthGoal)
    }

    if (
      latestBloodPressureRecord !== null &&
      (latestBloodPressureRecord.systolicBloodPressure > 120 ||
        latestBloodPressureRecord.diastolicBloodPressure > 80)
    ) {
      existingHealthGoal.updateBloodPressureGoalResult(false)
      existingHealthGoal.updateGoalStatus(HealthGoalStatus.GOAL_FAILED)
      await this.healthGoalRepository.save(existingHealthGoal)
    }

    if (
      latestBloodSugarRecord !== null &&
      latestBloodSugarRecord.bloodSugarValue >= 100
    ) {
      existingHealthGoal.updateBloodSugarGoalResult(false)
      existingHealthGoal.updateGoalStatus(HealthGoalStatus.GOAL_FAILED)
      await this.healthGoalRepository.save(existingHealthGoal)
    }

    if (
      latestWeightRecord !== null &&
      (latestWeightRecord.bodyMassIndex < 18.5 ||
        latestWeightRecord.bodyMassIndex >= 24)
    ) {
      existingHealthGoal.updateWeightGoalResult(false)
      existingHealthGoal.updateGoalStatus(HealthGoalStatus.GOAL_FAILED)
      await this.healthGoalRepository.save(existingHealthGoal)
    }

    if (
      latestGlycatedHemoglobinValue !== null &&
      latestGlycatedHemoglobinValue > 5.7
    ) {
      existingHealthGoal.updateGlycatedHemoglobinGoalResult(false)
      existingHealthGoal.updateGoalStatus(HealthGoalStatus.GOAL_FAILED)
      await this.healthGoalRepository.save(existingHealthGoal)
    }

    return {
      id: existingHealthGoal.id,
      bloodPressureCurrentValue:
        latestBloodPressureRecord !== null
          ? {
              systolicBloodPressure:
                latestBloodPressureRecord.systolicBloodPressure,
              diastolicBloodPressure:
                latestBloodPressureRecord.diastolicBloodPressure,
            }
          : null,
      bloodPressureTargetValue: {
        systolicBloodPressure:
          existingHealthGoal.bloodPressureTargetValue.systolicBloodPressure,
        diastolicBloodPressure:
          existingHealthGoal.bloodPressureTargetValue.diastolicBloodPressure,
      },
      bloodSugarCurrentValue:
        latestBloodSugarRecord !== null
          ? latestBloodSugarRecord.bloodSugarValue
          : null,
      bloodSugarCurrentType:
        latestBloodSugarRecord !== null
          ? latestBloodSugarRecord.bloodSugarType
          : null,
      bloodSugarTargetValue: existingHealthGoal.bloodSugarTargetValue,
      bloodSugarTargetType: existingHealthGoal.bloodSugarTargetType,
      glycatedHemoglobinCurrentValue: latestGlycatedHemoglobinValue,
      glycatedHemoglobinTargetValue:
        existingHealthGoal.glycatedHemoglobinTargetValue,
      weightCurrentValue:
        latestWeightRecord !== null ? latestWeightRecord.weightValueKg : null,
      weightTargetValue: existingHealthGoal.weightTargetValue,
      bodyMassIndexCurrentValue:
        latestWeightRecord !== null ? latestWeightRecord.bodyMassIndex : null,
      bodyMassIndexTargetValue: existingHealthGoal.bodyMassIndexTargetValue,
      startAt: existingHealthGoal.startAt,
      result: {
        bloodPressureGoalAchieved:
          existingHealthGoal.result !== null
            ? existingHealthGoal.result.bloodPressureGoalAchieved
            : false,
        bloodSugarGoalAchieved:
          existingHealthGoal.result !== null
            ? existingHealthGoal.result.bloodSugarGoalAchieved
            : false,
        glycatedHemoglobinGoalAchieved:
          existingHealthGoal.result !== null
            ? existingHealthGoal.result.glycatedHemoglobinGoalAchieved
            : false,
        weightGoalAchieved:
          existingHealthGoal.result !== null
            ? existingHealthGoal.result.weightGoalAchieved
            : false,
      },
      endAt: existingHealthGoal.endAt,
      status: existingHealthGoal.status,
      createdAt: existingHealthGoal.createdAt,
      updatedAt: existingHealthGoal.updatedAt,
    }
  }
}
