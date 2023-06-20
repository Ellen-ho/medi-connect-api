import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface EditAnswerAgreementCommentRequest {
  user: User
  answerAgreementId: string
  comment: string | null
}

interface EditAnswerAgreementCommentResponse {
  id: string
  updatedAt: Date
}

export class EditAnswerAgreementCommentUseCase {
  constructor(
    private readonly answerAgreementRepository: IAnswerAgreementRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: EditAnswerAgreementCommentRequest
  ): Promise<EditAnswerAgreementCommentResponse> {
    const { user, answerAgreementId, comment } = request

    if (comment == null) {
      throw new ValidationError('Comment cannot be empty after editing')
    }

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const existingAnswerAgreement =
      await this.answerAgreementRepository.findByIdAndAgreedDoctorId(
        answerAgreementId,
        existingDoctor.id
      )

    if (existingAnswerAgreement == null) {
      throw new NotFoundError('Answer agreement does not exist.')
    }

    existingAnswerAgreement.updateComment(comment)

    await this.answerAgreementRepository.save(existingAnswerAgreement)

    return {
      id: existingAnswerAgreement.id,
      updatedAt: existingAnswerAgreement.updatedAt,
    }
  }
}
