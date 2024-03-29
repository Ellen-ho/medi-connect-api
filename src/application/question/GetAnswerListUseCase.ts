import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetAnswerListRequest {
  user: User
  page?: number
  limit?: number
  searchKeyword?: string
}
interface GetAnswerListResponse {
  totalAnswerCounts: number
  data: Array<{
    id: string
    content: string
    createdAt: Date
    thankCounts: number
    agreeCounts: number
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetAnswerListUseCase {
  constructor(
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: GetAnswerListRequest
  ): Promise<GetAnswerListResponse> {
    const { user } = request
    const searchKeyword: string =
      request.searchKeyword != null ? request.searchKeyword : ''
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const currentDoctor = await this.doctorRepository.findByUserId(user.id)

    if (currentDoctor == null) {
      throw new AuthorizationError('Current doctor does not exist.')
    }

    const filteredAnswers =
      await this.patientQuestionAnswerRepository.findFilteredAndCountByDoctorId(
        currentDoctor.id,
        limit,
        offset,
        searchKeyword
      )

    if (filteredAnswers !== null) {
      return {
        totalAnswerCounts: filteredAnswers.totalAnswerCounts,
        data: filteredAnswers.data,
        pagination: getPagination(
          limit,
          page,
          filteredAnswers.totalAnswerCounts
        ),
      }
    }

    const existingAnswers =
      await this.patientQuestionAnswerRepository.findFilteredAndCountByDoctorId(
        currentDoctor.id,
        limit,
        offset,
        searchKeyword
      )

    if (existingAnswers.totalAnswerCounts === 0) {
      return {
        totalAnswerCounts: 0,
        data: [],
        pagination: getPagination(limit, page, 0),
      }
    }

    return {
      totalAnswerCounts: existingAnswers.totalAnswerCounts,
      data: existingAnswers.data,
      pagination: getPagination(limit, page, existingAnswers.totalAnswerCounts),
    }
  }
}
