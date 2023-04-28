import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { User } from '../../domain/user/User'

interface CancelAnswerAppreciationRequest {
  user: User
  answerAppreciationId: string
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
    const { user, answerAppreciationId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingAnswerAppreciation =
      await this.answerAppreciationRepository.findByIdAndPatientId(
        answerAppreciationId,
        existingPatient.id
      )
    if (existingAnswerAppreciation == null) {
      throw new Error('Answer appreciation does not exist.')
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