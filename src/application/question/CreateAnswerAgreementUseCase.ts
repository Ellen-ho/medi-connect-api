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

    const existingAnswerAgreement =
      await this.answerAgreementRepository.findByAnswerIdAndAgreedDoctorId(
        answerId,
        existingDoctor.id
      )

    if (existingAnswerAgreement !== null) {
      throw new Error('Agreement to this answer by you already exists.')
    }

    const answerAgreement = new AnswerAgreement({
      id: this.uuidService.generateUuid(),
      comment,
      answerId: existingAnswer.id,
      agreedDoctorId: existingDoctor.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await this.answerAgreementRepository.save(answerAgreement)

    const totalAgreedDoctorCounts =
      await this.answerAgreementRepository.countsByAnswerId(answerId)

    const agreedDoctorAvatars =
      await this.answerAgreementRepository.findAgreedDoctorAvatarsByAnswerId(
        answerId
      )

    return {
      id: answerAgreement.id,
      answerId: answerAgreement.answerId,
      totalAgreedDoctorCounts,
      agreedDoctorAvatars,
      createdAt: answerAgreement.createdAt,
      updatedAt: answerAgreement.updatedAt,
    }
  }
}
