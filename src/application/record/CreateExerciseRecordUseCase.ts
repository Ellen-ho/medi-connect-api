import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import {
  ExerciseRecord,
  ExerciseType,
  IntensityType,
} from '../../domain/record/ExerciseRecord'
import { IExerciseRecordRepository } from '../../domain/record/interfaces/repositories/IExerciseRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateExerciseRecordRequest {
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

export class CreateExerciseRecord {
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
      throw new Error('Patient does not exist.')
    }

    // no other: kc from standard
    const exerciseRecord = new ExerciseRecord({
      id: this.uuidService.generateUuid(),
      exerciseDate,
      exerciseType,
      exerciseDurationMinute,
      exerciseIntensity,
      kcaloriesBurned: 355, // TODO: this is a mock, need standard mapping later
      exerciseNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: existingPatient,
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
