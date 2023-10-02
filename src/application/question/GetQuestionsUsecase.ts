import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'
interface GetQuestionsRequest {
  page?: number
  limit?: number
  searchKeyword?: string
}
interface GetQuestionsResponse {
  totalCounts: number
  data: Array<{
    id: string
    content: string
    createdAt: Date
    answerCounts: number
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetQuestionsUseCase {
  constructor(
    private readonly patientQuestionRepository: IPatientQuestionRepository
  ) {}

  public async execute(
    request: GetQuestionsRequest
  ): Promise<GetQuestionsResponse> {
    const searchKeyword =
      request.searchKeyword != null ? request.searchKeyword : ''
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    if (searchKeyword !== null) {
      const filteredQuestions =
        await this.patientQuestionRepository.findAfterFiteredAndCountAll(
          limit,
          offset,
          searchKeyword
        )
      return {
        totalCounts: filteredQuestions.totalCounts,
        data: filteredQuestions.questions,
        pagination: getPagination(limit, page, filteredQuestions.totalCounts),
      }
    }

    const existingPatientQuestions =
      await this.patientQuestionRepository.findAndCountAll(limit, offset)

    return {
      totalCounts: existingPatientQuestions.totalCounts,
      data: existingPatientQuestions.questions,
      pagination: getPagination(
        limit,
        page,
        existingPatientQuestions.totalCounts
      ),
    }
  }
}
