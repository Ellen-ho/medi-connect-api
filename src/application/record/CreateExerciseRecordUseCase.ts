import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import {
  ExerciseRecord,
  ExerciseType,
  IntensityType,
} from '../../domain/record/ExerciseRecord'
import { IExerciseRecordRepository } from '../../domain/record/interfaces/repositories/IExerciseRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'

export interface CreateExerciseRecordRequest {
  user: User
  exerciseDate: Date
  exerciseType: ExerciseType
  exerciseDurationMinute: number
  exerciseIntensity: IntensityType
  exerciseNote: string | null
}

interface CreateExerciseRecordResponse {
  id: string
  exerciseDate: Date
  exerciseType: ExerciseType
  exerciseDurationMinute: number
  exerciseIntensity: IntensityType
  kcaloriesBurned: number
  exerciseNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class CreateExerciseRecordUseCase {
  constructor(
    private readonly exerciseRecordRepository: IExerciseRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateExerciseRecordRequest
  ): Promise<CreateExerciseRecordResponse> {
    const {
      user,
      exerciseDate,
      exerciseType,
      exerciseDurationMinute,
      exerciseIntensity,
      exerciseNote,
    } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const exerciseRecord = new ExerciseRecord({
      id: this.uuidService.generateUuid(),
      exerciseDate,
      exerciseType,
      exerciseDurationMinute,
      exerciseIntensity,
      kcaloriesBurned: ExerciseRecord.calculateTotalKcalories(
        exerciseType,
        exerciseDurationMinute
      ),
      exerciseNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
    })
    await this.exerciseRecordRepository.save(exerciseRecord)

    return {
      id: exerciseRecord.id,
      exerciseDate: exerciseRecord.exerciseDate,
      exerciseType: exerciseRecord.exerciseType,
      exerciseDurationMinute: exerciseRecord.exerciseDurationMinute,
      exerciseIntensity: exerciseRecord.exerciseIntensity,
      kcaloriesBurned: exerciseRecord.kcaloriesBurned,
      exerciseNote: exerciseRecord.exerciseNote,
      createdAt: exerciseRecord.createdAt,
      updatedAt: exerciseRecord.updatedAt,
    }
  }
}
