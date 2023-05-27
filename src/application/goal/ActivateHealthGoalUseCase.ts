import {
  HealthGoalStatus,
  IBloodPressureValue,
} from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { User } from '../../domain/user/User'

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
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: ActivateHealthGoalRequest
  ): Promise<ActivateHealthGoalResponse | null> {
    /**
     * 1. Check if the health goal exists
     * 2. Check if the health goal is for the user and the goal is in in progress or pending
     * 3. Activate the health goal
     * 4. Return the health goal
     */

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

    existingHealthGoal.activateGoal()

    await this.healthGoalRepository.save(existingHealthGoal)

    return {
      id: existingHealthGoal.id,
      bloodPressureTargetValue: existingHealthGoal.bloodPressureTargetValue,
      bloodSugarTargetValue: existingHealthGoal.bloodSugarTargetValue,
      bloodSugarTargetType: existingHealthGoal.bloodSugarTargetType,
      glycatedHemonglobinTargetValue:
        existingHealthGoal.glycatedHemonglobinTargetValue,
      weightTargetValue: existingHealthGoal.weightTargetValue,
      bodyMassIndexTargetValue: existingHealthGoal.bodyMassIndexTargetValue,
      startAt: existingHealthGoal.startAt,
      endAt: existingHealthGoal.endAt,
      status: existingHealthGoal.status,
      createdAt: existingHealthGoal.createdAt,
      updatedAt: existingHealthGoal.updatedAt,
    }
  }
}