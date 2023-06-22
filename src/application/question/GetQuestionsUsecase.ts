import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'
interface GetQuestionsRequest {
  page?: number
  limit?: number
}
interface GetQuestionsResponse {
  data: Array<{
    id: string
    content: string
    createdAt: Date
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

    const existingPatientQuestions =
      await this.patientQuestionRepository.findAndCountAll(limit, offset)

    if (existingPatientQuestions == null) {
      throw new NotFoundError('Questions do not exist.')
    }

    return {
      data: existingPatientQuestions.questions,
      pagination: getPagination(
        limit,
        page,
        existingPatientQuestions.total_counts
      ),
    }
  }
}
