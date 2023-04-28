import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { User } from '../../domain/user/User'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'

interface CancelPatientQuestionRequest {
  user: User
  patientQuestionId: string
}

interface CancelPatientQuestionResponse {
  patientQuestionId: string
}

export class CancelPatientQuestionUseCase {
  constructor(
    private readonly patientQuestionRepository: IPatientQuestionRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly answerAppreciationRepository: IAnswerAppreciationRepository,
    private readonly answerAgreementRepository: IAnswerAgreementRepository,
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository
  ) {}

  public async execute(
    request: CancelPatientQuestionRequest
  ): Promise<CancelPatientQuestionResponse> {
    const { user, patientQuestionId } = request

    const existingAsker = await this.patientRepository.findByUserId(user.id)

    if (existingAsker == null) {
      throw new Error('Asker does not exist.')
    }

    const existingPatientQuestion =
      await this.patientQuestionRepository.findByIdAndAskerId(
        patientQuestionId,
        existingAsker.id
      )

    if (existingPatientQuestion == null) {
      throw new Error('Question does not exist.')
    }

    const answers =
      await this.patientQuestionAnswerRepository.findAllByQuestionId(
        patientQuestionId
      )
    // TODO: add transaction here
    for (const answer of answers) {
      await this.answerAppreciationRepository.deleteAllByAnswerId(answer.id)
      await this.answerAgreementRepository.deleteAllByAnswerId(answer.id)
    }

    await this.patientQuestionAnswerRepository.deleteAllByQuestionId(
      patientQuestionId
    )

    await this.patientQuestionRepository.deleteById(existingPatientQuestion.id)

    return {
      patientQuestionId,
    }
  }
}
