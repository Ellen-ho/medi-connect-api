import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'

import { User } from '../../domain/user/User'

interface EditAnswerAppreciationRequest {
  user: User
  content: string | null
  answerAppreciationId: string
}

interface EditAnswerAppreciationResponse {
  id: string
  updatedAt: Date
}

export class EditAnswerAppreciationUseCase {
  constructor(
    private readonly answerAgreementRepository: IAnswerAppreciationRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: EditAnswerAppreciationRequest
  ): Promise<EditAnswerAppreciationResponse> {
    const { user, answerAppreciationId, content } = request

    if (content == null) {
      throw new Error('Content cannot be empty after editing')
    }

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingAnswerAppreciation =
      await this.answerAgreementRepository.findByIdAndPatientId(
        answerAppreciationId,
        existingPatient.id
      )

    if (existingAnswerAppreciation == null) {
      throw new Error('Answer appreciation does not exist.')
    }

    existingAnswerAppreciation.updateContent(content)

    await this.answerAgreementRepository.save(existingAnswerAppreciation)

    return {
      id: existingAnswerAppreciation.id,
      updatedAt: existingAnswerAppreciation.updatedAt,
    }
  }
}
