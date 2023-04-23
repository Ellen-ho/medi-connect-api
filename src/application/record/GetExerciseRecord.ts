import { ExerciseRecord } from '../../domain/record/ExerciseRecord'
import { IExerciseRecordRepository } from '../../domain/record/interfaces/repositories/IExerciseRepository'

interface GetExerciseRecordRequestDTO {
  id: string
}

interface GetExerciseRecordResponseDTO extends ExerciseRecord {}

export class GetExerciseRecord {
  constructor(
    private readonly exerciseRecordRepository: IExerciseRecordRepository
  ) {}

  public async execute(
    request: GetExerciseRecordRequestDTO
  ): Promise<GetExerciseRecordResponseDTO> {
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
