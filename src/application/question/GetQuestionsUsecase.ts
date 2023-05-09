import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'

interface GetQuestionsResponse {
  questions: Array<{
    content: string
  }>
}
export class GetQuestionsUseCase {
  constructor(
    private readonly patientQuestionRepository: IPatientQuestionRepository
  ) {}

  public async execute(): Promise<GetQuestionsResponse> {
    const existingPatientQuestions =
      await this.patientQuestionRepository.findAll()

    if (existingPatientQuestions == null) {
      throw new Error('Questions do not exist.')
    }

    /**
     * existingPatientQuestions = [
     *  {
     *     id: '111',
     *     content: '222',
     *     ....
     *  }
     *
     * ]
     *
     * result => [
     *  {
     *    content: '123'
     *  },
     *  {},
     *  ....
     * ]
     * const newArray = oldArray.map(item => {
     *   return {
     *     content: item.content
     *   }
     * })
     *
     *
     *
     */
    return {
      questions: existingPatientQuestions.map((question) => {
        return {
          content: question.content,
        }
      }),
    }
  }
}
