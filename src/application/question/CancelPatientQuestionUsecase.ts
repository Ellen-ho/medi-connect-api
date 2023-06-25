import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { User } from '../../domain/user/User'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IRepositoryTx } from '../../domain/shared/IRepositoryTx'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

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
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly tx: IRepositoryTx
  ) {}

  public async execute(
    request: CancelPatientQuestionRequest
  ): Promise<CancelPatientQuestionResponse> {
    const { user, patientQuestionId } = request

    const existingAsker = await this.patientRepository.findByUserId(user.id)

    if (existingAsker == null) {
      throw new AuthorizationError('Asker does not exist.')
    }

    const existingPatientQuestion =
      await this.patientQuestionRepository.findByIdAndAskerId(
        patientQuestionId,
        existingAsker.id
      )

    if (existingPatientQuestion == null) {
      throw new NotFoundError('Question does not exist.')
    }

    try {
      await this.tx.start()
      const txExecutor = this.tx.getExecutor()

      const answers =
        await this.patientQuestionAnswerRepository.findAllByQuestionId(
          patientQuestionId
        )

      for (const answer of answers) {
        await this.answerAppreciationRepository.deleteAllByAnswerId(
          answer.id,
          txExecutor
        )
        await this.answerAgreementRepository.deleteAllByAnswerId(
          answer.id,
          txExecutor
        )
      }

      await this.patientQuestionAnswerRepository.deleteAllByQuestionId(
        patientQuestionId,
        txExecutor
      )

      await this.patientQuestionRepository.deleteById(
        existingPatientQuestion.id,
        txExecutor
      )
      await this.tx.end()
      return { patientQuestionId }
    } catch (error) {
      await this.tx.rollback()
      throw error
    }
  }
}
