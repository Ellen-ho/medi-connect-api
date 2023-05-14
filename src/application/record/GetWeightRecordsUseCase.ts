import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetWeightRecordsRequest {
  page?: number
  limit?: number
}
interface GetWeightRecordsResponse {
  data: Array<{
    weightDate: Date
    weightValueKg: number
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetWeightRecordsUseCase {
  constructor(
    private readonly weightRecordRepository: IWeightRecordRepository
  ) {}

  public async execute(
    request: GetWeightRecordsRequest
  ): Promise<GetWeightRecordsResponse> {
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingWeightRecords =
      await this.weightRecordRepository.findAndCountAll(limit, offset)

    if (existingWeightRecords == null) {
      throw new Error('Records do not exist.')
    }

    return {
      data: existingWeightRecords.records,
      pagination: getPagination(
        limit,
        page,
        existingWeightRecords.total_counts
      ),
    }
  }
}
