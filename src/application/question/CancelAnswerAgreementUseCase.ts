import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { User } from '../../domain/user/User'

interface CancelAnswerAgreementRequest {
  user: User
  answerAgreementId: string
}

interface CancelAnswerAgreementResponse {
  totalAgreedDoctorCounts: number
  agreedDoctorAvatars: Array<string | null>
}

export class CancelAnswerAgreementUseCase {
  constructor(
    private readonly answerAgreementRepository: IAnswerAgreementRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: CancelAnswerAgreementRequest
  ): Promise<CancelAnswerAgreementResponse> {
    const { user, answerAgreementId } = request

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const existingAnswerAgreement =
      await this.answerAgreementRepository.findByIdAndAgreedDoctorId(
        answerAgreementId,
        existingDoctor.id
      )
    if (existingAnswerAgreement == null) {
      throw new Error('Answer agreement does not exist.')
    }

    await this.answerAgreementRepository.deleteById(existingAnswerAgreement.id)

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
