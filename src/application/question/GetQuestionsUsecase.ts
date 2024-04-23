import { MedicalSpecialtyType } from 'domain/question/PatientQuestion'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'
interface GetQuestionsRequest {
  page?: number
  limit?: number
  askerId?: string
  searchKeyword?: string
  medicalSpecialty?: MedicalSpecialtyType
}
interface GetQuestionsResponse {
  totalCounts: number
  data: Array<{
    id: string
    content: string
    createdAt: Date
    answerCounts: number
    medicalSpecialty: MedicalSpecialtyType
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
    const { askerId, searchKeyword, medicalSpecialty } = request
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const filteredQuestions =
      await this.patientQuestionRepository.findAfterFiteredAndCountAll(
        limit,
        offset,
        searchKeyword,
        medicalSpecialty,
        askerId
      )
    return {
      totalCounts: filteredQuestions.totalCounts,
      data: filteredQuestions.questions,
      pagination: getPagination(limit, page, filteredQuestions.totalCounts),
    }
  }
}
