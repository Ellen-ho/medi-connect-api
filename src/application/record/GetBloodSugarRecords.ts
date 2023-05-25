import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetBloodSugarRecordsRequest {
  page?: number
  limit?: number
}
interface GetBloodSugarRecordsResponse {
  data: Array<{
    bloodSugarDate: Date
    bloodSugarValue: number // mg/L
    bloodSugarType: BloodSugarType
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetBloodSugarRecordsUseCase {
  constructor(
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository
  ) {}

  public async execute(
    request: GetBloodSugarRecordsRequest
  ): Promise<GetBloodSugarRecordsResponse> {
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingBloodSugarRecords =
      await this.bloodSugarRecordRepository.findAndCountAll(limit, offset)

    if (existingBloodSugarRecords == null) {
      throw new Error('Records do not exist.')
    }

    return {
      data: existingBloodSugarRecords.records,
      pagination: getPagination(
        limit,
        page,
        existingBloodSugarRecords.total_counts
      ),
    }
  }
}
