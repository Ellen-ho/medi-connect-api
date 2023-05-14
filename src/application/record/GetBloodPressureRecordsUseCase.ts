import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetBloodPressureRecordsRequest {
  page?: number
  limit?: number
}
interface GetBloodPressureRecordsResponse {
  data: Array<{
    bloodPressureDate: Date
    systolicBloodPressure: number
    diastolicBloodPressure: number
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetBloodPressureRecordsUseCase {
  constructor(
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository
  ) {}

  public async execute(
    request: GetBloodPressureRecordsRequest
  ): Promise<GetBloodPressureRecordsResponse> {
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingBloodPressureRecords =
      await this.bloodPressureRecordRepository.findAndCountAll(limit, offset)

    if (existingBloodPressureRecords == null) {
      throw new Error('Records do not exist.')
    }

    return {
      data: existingBloodPressureRecords.records,
      pagination: getPagination(
        limit,
        page,
        existingBloodPressureRecords.total_counts
      ),
    }
  }
}
