import { ExerciseType } from '../../domain/record/ExerciseRecord'
import { IExerciseRecordRepository } from '../../domain/record/interfaces/repositories/IExerciseRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetExerciseRecordsRequest {
  page?: number
  limit?: number
}
interface GetExerciseRecordsResponse {
  data: Array<{
    exerciseDate: Date
    exerciseType: ExerciseType
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetExerciseRecordsUseCase {
  constructor(
    private readonly exerciseRecordRepository: IExerciseRecordRepository
  ) {}

  public async execute(
    request: GetExerciseRecordsRequest
  ): Promise<GetExerciseRecordsResponse> {
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingExerciseRecords =
      await this.exerciseRecordRepository.findAndCountAll(limit, offset)

    if (existingExerciseRecords == null) {
      throw new Error('Records do not exist.')
    }

    return {
      data: existingExerciseRecords.records,
      pagination: getPagination(
        limit,
        page,
        existingExerciseRecords.total_counts
      ),
    }
  }
}
