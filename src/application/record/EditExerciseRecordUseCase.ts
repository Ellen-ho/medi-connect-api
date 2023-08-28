import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { ExerciseType, IntensityType } from '../../domain/record/ExerciseRecord'
import { IExerciseRecordRepository } from '../../domain/record/interfaces/repositories/IExerciseRepository'

import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface EditExerciseRecordRequest {
  user: User
  exerciseRecordId: string
  exerciseDate: Date
  exerciseType: ExerciseType
  exerciseDurationMinute: number
  exerciseIntensity: IntensityType
  exerciseNote: string | null
}

interface EditExerciseRecordResponse {
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

export class EditExerciseRecordUseCase {
  constructor(
    private readonly exerciseRecordRepository: IExerciseRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: EditExerciseRecordRequest
  ): Promise<EditExerciseRecordResponse> {
    const {
      user,
      exerciseRecordId,
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

    const existingExerciseRecord =
      await this.exerciseRecordRepository.findByIdAndPatientId(
        exerciseRecordId,
        existingPatient.id
      )

    if (existingExerciseRecord == null) {
      throw new NotFoundError('This exercise record does not exist.')
    }

    existingExerciseRecord.updateData({
      exerciseDate,
      exerciseType,
      exerciseDurationMinute,
      exerciseIntensity,
      kcaloriesBurned: 500,
      exerciseNote,
    })

    await this.exerciseRecordRepository.save(existingExerciseRecord)

    return {
      id: existingExerciseRecord.id,
      exerciseDate: existingExerciseRecord.exerciseDate,
      exerciseType: existingExerciseRecord.exerciseType,
      exerciseDurationMinute: existingExerciseRecord.exerciseDurationMinute,
      exerciseIntensity: existingExerciseRecord.exerciseIntensity,
      kcaloriesBurned: existingExerciseRecord.kcaloriesBurned,
      exerciseNote: existingExerciseRecord.exerciseNote,
      createdAt: existingExerciseRecord.createdAt,
      updatedAt: existingExerciseRecord.updatedAt,
    }
  }
}
