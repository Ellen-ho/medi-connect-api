import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

export interface CancelAnswerAgreementRequest {
  user: User
  answerId: string
}

interface CancelAnswerAgreementResponse {
  totalAgreedDoctorCounts: number
  agreedDoctorAvatars: Array<string | null>
}

export class CancelAnswerAgreementUseCase {
  constructor(
    private readonly answerAgreementRepository: IAnswerAgreementRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository
  ) {}

  public async execute(
    request: CancelAnswerAgreementRequest
  ): Promise<CancelAnswerAgreementResponse> {
    const { user, answerId } = request

    const existingAnswer = await this.patientQuestionAnswerRepository.findById(
      answerId
    )
    if (existingAnswer == null) {
      throw new NotFoundError('Answer does not exist.')
    }
    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const existingAnswerAgreement =
      await this.answerAgreementRepository.findByAnswerIdAndAgreedDoctorId(
        existingAnswer.id,
        existingDoctor.id
      )
    if (existingAnswerAgreement == null) {
      throw new NotFoundError('Answer agreement does not exist.')
    }

    await this.answerAgreementRepository.delete(existingAnswerAgreement)

    const totalAgreedDoctorCounts =
      await this.answerAgreementRepository.countsByAnswerId(
        existingAnswerAgreement.answerId
      )

    const agreedDoctorAvatars =
      await this.answerAgreementRepository.findAgreedDoctorAvatarsByAnswerId(
        existingAnswerAgreement.answerId
      )

    return {
      totalAgreedDoctorCounts,
      agreedDoctorAvatars,
    }
  }
}
