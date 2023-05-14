import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetGlycatedHemoglobinRecordsRequest {
  page?: number
  limit?: number
}
interface GetGlycatedHemoglobinRecordsResponse {
  data: Array<{
    glycatedHemoglobinDate: Date
    glycatedHemoglobinValuePercent: number
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetGlycatedHemoglobinRecordsUseCase {
  constructor(
    private readonly glycatedHemoglobinRecordRepository: IGlycatedHemoglobinRecordRepository
  ) {}

  public async execute(
    request: GetGlycatedHemoglobinRecordsRequest
  ): Promise<GetGlycatedHemoglobinRecordsResponse> {
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingGlycatedHemoglobinRecords =
      await this.glycatedHemoglobinRecordRepository.findAndCountAll(
        limit,
        offset
      )

    if (existingGlycatedHemoglobinRecords == null) {
      throw new Error('Records do not exist.')
    }

    return {
      data: existingGlycatedHemoglobinRecords.records,
      pagination: getPagination(
        limit,
        page,
        existingGlycatedHemoglobinRecords.total_counts
      ),
    }
  }
}
