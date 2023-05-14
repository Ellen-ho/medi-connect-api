import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { ExerciseType, IntensityType } from '../../domain/record/ExerciseRecord'
import { IExerciseRecordRepository } from '../../domain/record/interfaces/repositories/IExerciseRepository'
import { User } from '../../domain/user/User'

interface GetSingleExerciseRecordRequest {
  user: User
  exerciseRecordId: string
}

interface GetSingleExerciseRecordResponse {
  data: {
    exerciseDate: Date
    exerciseType: ExerciseType
    exerciseDurationMinute: number
    exerciseIntensity: IntensityType
    kcaloriesBurned: number
    exerciseNote: string | null
    createdAt: Date
    updatedAt: Date
  }
  recordOwner: IRecordOwner
}

export interface IRecordOwner {
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
}

export interface IExerciseRecordWithOwner {
  id: string
  exerciseDate: Date
  exerciseType: ExerciseType
  exerciseDurationMinute: number
  exerciseIntensity: IntensityType
  kcaloriesBurned: number
  exerciseNote: string | null
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleExerciseRecordUseCase {
  constructor(
    private readonly exerciseRecordRepository: IExerciseRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: GetSingleExerciseRecordRequest
  ): Promise<GetSingleExerciseRecordResponse> {
    const { user, exerciseRecordId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const recordWithOwner =
      await this.exerciseRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        exerciseRecordId,
        existingPatient.id
      )

    if (recordWithOwner == null) {
      throw new Error('Record does not exist.')
    }

    return {
      data: {
        exerciseDate: recordWithOwner.exerciseDate,
        exerciseType: recordWithOwner.exerciseType,
        exerciseDurationMinute: recordWithOwner.exerciseDurationMinute,
        exerciseIntensity: recordWithOwner.exerciseIntensity,
        kcaloriesBurned: recordWithOwner.kcaloriesBurned,
        exerciseNote: recordWithOwner.exerciseNote,
        createdAt: recordWithOwner.createdAt,
        updatedAt: recordWithOwner.updatedAt,
      },
      recordOwner: {
        firstName: recordWithOwner.patientFirstName,
        lastName: recordWithOwner.patientLastName,
        birthDate: recordWithOwner.patientBirthDate,
        gender: recordWithOwner.patientGender,
      },
    }
  }
}

/**
 * Get list filter by food category, execercise type
 * Get single record by id
 */
