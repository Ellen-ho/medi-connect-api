import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface CancelAnswerAppreciationRequest {
  user: User
  answerId: string
}

interface CancelAnswerAppreciationResponse {
  totalThankCounts: number
}

export class CancelAnswerAppreciationUseCase {
  constructor(
    private readonly answerAppreciationRepository: IAnswerAppreciationRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: CancelAnswerAppreciationRequest
  ): Promise<CancelAnswerAppreciationResponse> {
    const { user, answerId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const existingAnswerAppreciation =
      await this.answerAppreciationRepository.findByAnswerIdAndPatientId(
        answerId,
        existingPatient.id
      )
    if (existingAnswerAppreciation == null) {
      throw new NotFoundError('Answer appreciation does not exist.')
    }

    await this.answerAppreciationRepository.deleteById(
      existingAnswerAppreciation.id
    )

    const totalThankCounts =
      await this.answerAppreciationRepository.countByAnswerId(
        existingAnswerAppreciation.answer.id
      )

    return {
      totalThankCounts,
    }
  }
}
