import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { User } from '../../domain/user/User'
import dayjs from 'dayjs'

interface GetSingleQuestionRequest {
  user: User
  patientQuestionId: string
}

interface GetSingleQuestionResponse {
  question: {
    content: string
    askerAge: number
  }
  answers: IAnswer[]
}

export interface IAnswer {
  doctorAvatars: Array<string | null>
  content: string
  avatar: string | null
  firstName: string
  lastName: string
  specialties: string[]
  careerStartDate: Date
  agreeCounts: number
  thankCounts: number
  isThanked: boolean
}

export class GetSingleQuestionUseCase {
  constructor(
    private readonly patientQuestionRepository: IPatientQuestionRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository
  ) {}

  public async execute(
    request: GetSingleQuestionRequest
  ): Promise<GetSingleQuestionResponse> {
    const { user, patientQuestionId } = request

    const existingPatientQuestion =
      await this.patientQuestionRepository.findById(patientQuestionId)

    if (existingPatientQuestion == null) {
      throw new Error('Question does not exist.')
    }

    const asker = await this.patientRepository.findById(
      existingPatientQuestion.askerId
    )

    if (asker == null) {
      throw new Error('Asker does not exist.')
    }

    const answerDetails =
      await this.patientQuestionAnswerRepository.findAnswerDetailsByQuestionIdAndPatientId(
        patientQuestionId,
        user.id
      )

    return {
      question: {
        content: existingPatientQuestion.content,
        askerAge: dayjs().diff(dayjs(asker.birthDate), 'year'),
      },
      answers: answerDetails,
    }
  }
}
