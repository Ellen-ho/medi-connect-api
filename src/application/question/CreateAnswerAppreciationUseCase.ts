import { Patient } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { AnswerAppreciation } from '../../domain/question/AnswerAppreciation'
import { PatientQuestionAnswer } from '../../domain/question/PatientQuestionAnswer'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateAnswerAppreciationRequest {
  user: User
  content: string
  answerId: string
}

interface CreateAnswerAppreciationResponse {
  id: string
  answerId: string
  isThanked: boolean
  totalThankCounts: number
  createdAt: Date
  updatedAt: Date
}

export class CreateAnswerAppreciationUseCase {
  constructor(
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly answerAppreciationRepository: IAnswerAppreciationRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateAnswerAppreciationRequest
  ): Promise<CreateAnswerAppreciationResponse> {
    const { user, content, answerId } = request

    const existingAnswer = await this.patientQuestionAnswerRepository.findById(
      answerId
    )
    if (existingAnswer == null) {
      throw new Error('Answer does not exist.')
    }

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const answerAppreciation = new AnswerAppreciation({
      id: this.uuidService.generateUuid(),
      content,
      patient: existingPatient,
      createdAt: new Date(),
      updatedAt: new Date(),
      answer: existingAnswer,
    })
    await this.answerAppreciationRepository.save(answerAppreciation)

    return {
      id: answerAppreciation.id,
      answerId: existingAnswer.id,
      patient: existingPatient,
      isThanked,
      totalThankCounts,
      createdAt: answerAppreciation.createdAt,
      updatedAt: answerAppreciation.updatedAt,
    }
  }
}
