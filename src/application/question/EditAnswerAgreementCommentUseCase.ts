import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { User } from '../../domain/user/User'

interface EditAnswerAgreementRequest {
  user: User
  answerAgreementId: string
  comment: string | null
}

interface EditAnswerAgreementResponse {
  id: string
  updatedAt: Date
}

export class EditAnswerAgreementUseCase {
  constructor(
    private readonly answerAgreementRepository: IAnswerAgreementRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: EditAnswerAgreementRequest
  ): Promise<EditAnswerAgreementResponse> {
    const { user, answerAgreementId, comment } = request

    if (comment == null) {
      throw new Error('Comment cannot be empty after editing')
    }

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

    existingAnswerAgreement.updateComment(comment)

    await this.answerAgreementRepository.save(existingAnswerAgreement)

    return {
      id: existingAnswerAgreement.id,
      updatedAt: existingAnswerAgreement.updatedAt,
    }
  }
}
