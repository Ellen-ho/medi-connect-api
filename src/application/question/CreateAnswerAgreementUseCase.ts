import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { AnswerAgreement } from '../../domain/question/AnswerAgreement'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'

interface CreateAnswerAgreementRequest {
  user: User
  answerId: string
  comment: string | null
}

interface CreateAnswerAgreementResponse {
  id: string
  answerId: string
  totalAgreedDoctorCounts: number
  agreedDoctorAvatars: Array<string | null>
  createdAt: Date
  updatedAt: Date
}

export class CreateAnswerAgreementUseCase {
  constructor(
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly answerAgreementRepository: IAnswerAgreementRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateAnswerAgreementRequest
  ): Promise<CreateAnswerAgreementResponse> {
    const { user, answerId, comment } = request

    const existingAnswer = await this.patientQuestionAnswerRepository.findById(
      answerId
    )

    if (existingAnswer == null) {
      throw new Error('Answer does not exist.')
    }

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const answerAgreement = new AnswerAgreement({
      id: this.uuidService.generateUuid(),
      comment,
      answer: existingAnswer,
      agreedDoctor: existingDoctor,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await this.answerAgreementRepository.save(answerAgreement)

    const totalAgreedDoctorCounts =
      await this.answerAgreementRepository.countsByAnswerId(answerId)

    const lastAnswerAgreements =
      await this.answerAgreementRepository.findAllByAnswerId(answerId, 3)

    const agreedDoctorAvatars = lastAnswerAgreements.map(
      (answerAgreement) => answerAgreement.agreedDoctor.avatar
    )

    return {
      id: answerAgreement.id,
      answerId: answerAgreement.answer.id,
      totalAgreedDoctorCounts,
      agreedDoctorAvatars,
      createdAt: answerAgreement.createdAt,
      updatedAt: answerAgreement.updatedAt,
    }
  }
}
