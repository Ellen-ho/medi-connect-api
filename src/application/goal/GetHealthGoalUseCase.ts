import {
  HealthGoalStatus,
  IBloodPressureValue,
  IHealthGoalResult,
} from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { User } from '../../domain/user/User'
interface GetHealthGoalRequest {
  healthGoalId: string
  user: User
}

interface GetHealthGoalResponse {
  id: string
  currentBloodPressureValue: number | null
  bloodPressureTargetValue: IBloodPressureValue
  currentBloodSugarValue: number | null
  currentBloodSugarType: BloodSugarType | null
  bloodSugarTargetValue: number
  bloodSugarTargetType: BloodSugarType
  currentGlycatedHemonglobinValue: number | null
  glycatedHemonglobinTargetValue: number
  currentWeightValue: number | null
  weightTargetValue: number
  currentbBodyMassIndexValue: number | null
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
    private readonly patientRepository: IPatientRepository
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

    await this.healthGoalRepository.save(existingHealthGoal)

    return {
      id: existingHealthGoal.id,
      currentBloodPressureValue: existingHealthGoal.currentBloodPressureValue,
      bloodPressureTargetValue: existingHealthGoal.bloodPressureTargetValue,
      currentBloodSugarValue: existingHealthGoal.currentBloodSugarValue,
      currentBloodSugarType: existingHealthGoal.currentBloodSugarType,
      bloodSugarTargetValue: existingHealthGoal.bloodSugarTargetValue,
      bloodSugarTargetType: existingHealthGoal.bloodSugarTargetType,
      currentGlycatedHemonglobinValue:
        existingHealthGoal.currentGlycatedHemonglobinValue,
      glycatedHemonglobinTargetValue:
        existingHealthGoal.glycatedHemonglobinTargetValue,
      currentWeightValue: existingHealthGoal.currentWeightValue,
      weightTargetValue: existingHealthGoal.weightTargetValue,
      currentbBodyMassIndexValue: existingHealthGoal.currentbBodyMassIndexValue,
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
