import { FoodCategoryType } from '../../domain/record/FoodRecord'
import { IFoodRecordRepository } from '../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetFoodRecordsRequest {
  page?: number
  limit?: number
}
interface GetFoodRecordsResponse {
  data: Array<{
    foodTime: Date
    foodCategory: FoodCategoryType
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetFoodRecordsUseCase {
  constructor(private readonly foodRecordRepository: IFoodRecordRepository) {}

  public async execute(
    request: GetFoodRecordsRequest
  ): Promise<GetFoodRecordsResponse> {
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingFoodRecords = await this.foodRecordRepository.findAndCountAll(
      limit,
      offset
    )

    if (existingFoodRecords == null) {
      throw new Error('Records do not exist.')
    }

    return {
      data: existingFoodRecords.records,
      pagination: getPagination(limit, page, existingFoodRecords.total_counts),
    }
  }
}
