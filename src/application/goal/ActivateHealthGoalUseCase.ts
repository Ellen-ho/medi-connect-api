import {
  HealthGoalStatus,
  IBloodPressureValue,
} from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

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
    const { user, healthGoalId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const existingHealthGoal = await this.healthGoalRepository.findById(
      healthGoalId
    )

    if (existingHealthGoal === null) {
      throw new NotFoundError('HealthGoal does not exist.')
    }

    if (existingHealthGoal.status !== HealthGoalStatus.PENDING) {
      throw new ValidationError(
        'HealthGoal status can only be changed if it is in pending.'
      )
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
