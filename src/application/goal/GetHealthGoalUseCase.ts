import {
  HealthGoalStatus,
  IBloodPressureValue,
  IHealthGoalResult,
} from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { User } from '../../domain/user/User'
interface GetHealthGoalRequest {
  healthGoalId: string
  user: User
}

interface GetHealthGoalResponse {
  id: string
  bloodPressureCurrentValue: IBloodPressureValue | null
  bloodPressureTargetValue: IBloodPressureValue
  bloodSugarCurrentValue: number | null
  bloodSugarCurrentType: BloodSugarType | null
  bloodSugarTargetValue: number
  bloodSugarTargetType: BloodSugarType
  glycatedHemonglobinCurrentValue: number | null
  glycatedHemonglobinTargetValue: number
  weightCurrentValue: number | null
  weightTargetValue: number
  bodyMassIndexCurrentValue: number | null
  bodyMassIndexTargetValue: number
  startAt: Date
  endAt: Date
  status: HealthGoalStatus
  result: IHealthGoalResult | null
  createdAt: Date
  updatedAt: Date
}
export class GetHealthGoalUseCase {
  constructor(
    private readonly healthGoalRepository: IHealthGoalRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly glycatedHemonglobinRecordRepository: IGlycatedHemoglobinRecordRepository,
    private readonly weightRecordRepository: IWeightRecordRepository
  ) {}

  public async execute(
    request: GetHealthGoalRequest
  ): Promise<GetHealthGoalResponse | null> {
    const { user, healthGoalId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingHealthGoal = await this.healthGoalRepository.findById(
      healthGoalId
    )

    if (existingHealthGoal === null) {
      throw new Error('HealthGoal does not exist.')
    }

    const latestBloodPressureRecord =
      await this.bloodPressureRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        new Date()
      )

    const latestBloodSugarRecord =
      await this.bloodSugarRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        new Date()
      )

    const latestGlycatedHemonglobinRecord =
      await this.glycatedHemonglobinRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        new Date()
      )

    const latestWeightRecord =
      await this.weightRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        new Date()
      )

    const latestBodyMassIndexRecord =
      await this.weightRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        new Date()
      )

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
      bloodPressureTargetValue: existingHealthGoal.bloodPressureTargetValue,
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
      glycatedHemonglobinCurrentValue:
        latestGlycatedHemonglobinRecord !== null
          ? latestGlycatedHemonglobinRecord.glycatedHemoglobinValuePercent
          : null,
      glycatedHemonglobinTargetValue:
        existingHealthGoal.glycatedHemonglobinTargetValue,
      weightCurrentValue:
        latestWeightRecord !== null ? latestWeightRecord.weightValueKg : null,
      weightTargetValue: existingHealthGoal.weightTargetValue,
      bodyMassIndexCurrentValue:
        latestBodyMassIndexRecord !== null
          ? latestBodyMassIndexRecord.bodyMassIndex
          : null,
      bodyMassIndexTargetValue: existingHealthGoal.bodyMassIndexTargetValue,
      startAt: existingHealthGoal.startAt,
      result: existingHealthGoal.result,
      endAt: existingHealthGoal.endAt,
      status: existingHealthGoal.status,
      createdAt: existingHealthGoal.createdAt,
      updatedAt: existingHealthGoal.updatedAt,
    }
  }
}
