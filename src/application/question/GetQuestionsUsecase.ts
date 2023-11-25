import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'
interface GetQuestionsRequest {
  page?: number
  limit?: number
  askerId?: string
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
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)
    const askerId = request.askerId

    const existingPatientQuestions =
      await this.patientQuestionRepository.findAndCountAll(
        limit,
        offset,
        askerId
      )

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
