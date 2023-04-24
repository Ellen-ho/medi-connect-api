import { ExerciseRecord } from '../../domain/record/ExerciseRecord'
import { IExerciseRecordRepository } from '../../domain/record/interfaces/repositories/IExerciseRepository'
import { User } from '../../domain/user/User'

interface GetExerciseRecordRequest {
  user: User
  id: string
}

interface GetExerciseRecordResponse extends ExerciseRecord {}

export class GetExerciseRecord {
  constructor(
    private readonly exerciseRecordRepository: IExerciseRecordRepository
  ) {}

  public async execute(
    request: GetExerciseRecordRequest
  ): Promise<GetExerciseRecordResponse> {
    const { id } = request

    const existingExerciseRecord = await this.exerciseRecordRepository.findById(
      id
    )

    if (existingExerciseRecord == null) {
      throw new Error('ExerciseRecord not found')
    }

    return existingExerciseRecord
  }
}

/**
 * Get list filter by food category, execercise type
 * Get single record by id
 */
