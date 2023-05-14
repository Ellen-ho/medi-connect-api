import { SleepQualityType } from '../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../domain/record/interfaces/repositories/ISleepRecordRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetSleepRecordsRequest {
  page?: number
  limit?: number
}
interface GetSleepRecordsResponse {
  data: Array<{
    sleepDate: Date
    sleepQuality: SleepQualityType
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetSleepRecordsUseCase {
  constructor(private readonly sleepRecordRepository: ISleepRecordRepository) {}

  public async execute(
    request: GetSleepRecordsRequest
  ): Promise<GetSleepRecordsResponse> {
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingSleepRecords =
      await this.sleepRecordRepository.findAndCountAll(limit, offset)

    if (existingSleepRecords == null) {
      throw new Error('Records do not exist.')
    }

    return {
      data: existingSleepRecords.records,
      pagination: getPagination(limit, page, existingSleepRecords.total_counts),
    }
  }
}
