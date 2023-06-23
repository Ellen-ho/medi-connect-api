import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import dayjs from 'dayjs'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'

interface GetSingleQuestionRequest {
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
  specialties: MedicalSpecialtyType[]
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
    const { patientQuestionId } = request

    const existingPatientQuestion =
      await this.patientQuestionRepository.findById(patientQuestionId)

    if (existingPatientQuestion == null) {
      throw new NotFoundError('Question does not exist.')
    }

    const asker = await this.patientRepository.findById(
      existingPatientQuestion.askerId
    )

    if (asker == null) {
      throw new AuthorizationError('Asker does not exist.')
    }

    const answerDetails =
      await this.patientQuestionAnswerRepository.findAnswerDetailsByQuestionIdAndPatientId(
        patientQuestionId,
        asker.id
      )

    if (answerDetails.length === 0) {
      throw new NotFoundError('No answer for this question.')
    }
    return {
      question: {
        content: existingPatientQuestion.content,
        askerAge: dayjs().diff(dayjs(asker.birthDate), 'year'),
      },
      answers: answerDetails,
    }
  }
}
