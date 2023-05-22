import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import {
  HealthGoal,
  HealthGoalStatus,
  IBloodPressureValue,
  IHealthGoalResult,
} from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateHealthGoalRequest {
  user: User
}

interface CreateHealthGoalResponse {
  id: string
  bloodPressureTargetValue: IBloodPressureValue
  bloodSugarTargetValue: number
  glycatedHemonglobinTargetValue: number
  weightTargetValue: number
  startAt: Date
  endAt: Date
  status: HealthGoalStatus
  result: IHealthGoalResult
  createdAt: Date
  updatedAt: Date
}

export class CreateHealthGoalUseCase {
  constructor(
    private readonly healthGoalRepository: IHealthGoalRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateHealthGoalRequest
  ): Promise<CreateHealthGoalResponse> {
    const { user } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const healthGoal = new HealthGoal({
      id: this.uuidService.generateUuid(),
      bloodPressureTargetValue: {
        systolicBloodPressure: 120,
        diastolicBloodPressure: 80,
      },
      bloodSugarTargetValue: 100,
      glycatedHemonglobinTargetValue: 5,
      weightTargetValue: 50,
      startAt: new Date(),
      endAt: new Date(),
      status: HealthGoalStatus.PARTIAL_GOALS_ACHIEVED,
      result: {
        bloodPressure: {
          currentValue: {
            systolicBloodPressure: 130,
            diastolicBloodPressure: 90,
          },
          goalAchieved: false,
          currentValueDate: new Date(),
        },
        bloodSugar: {
          currentValue: 90,
          goalAchieved: true,
          currentValueDate: new Date(),
        },
        glycatedHemonglobin: {
          currentValue: 5,
          goalAchieved: true,
          currentValueDate: new Date(),
        },
        weight: {
          currentValue: 60,
          goalAchieved: true,
          currentValueDate: new Date(),
        },
      },
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
      glycatedHemonglobinTargetValue: healthGoal.glycatedHemonglobinTargetValue,
      weightTargetValue: healthGoal.weightTargetValue,
      startAt: new Date(),
      endAt: new Date(),
      status: healthGoal.status,
      result: healthGoal.result,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}
