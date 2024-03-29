import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IRepositoryTx } from '../../domain/shared/IRepositoryTx'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface CancelPatientQuestionAnswerRequest {
  user: User
  answerId: string
}

interface CancelPatientQuestionAnswerResponse {
  answerId: string
}

export class CancelPatientQuestionAnswerUseCase {
  constructor(
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly answerAppreciationRepository: IAnswerAppreciationRepository,
    private readonly answerAgreementRepository: IAnswerAgreementRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: CancelPatientQuestionAnswerRequest,
    tx: IRepositoryTx
  ): Promise<CancelPatientQuestionAnswerResponse> {
    const { user, answerId } = request

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const existingPatientQuestionAnswer =
      await this.patientQuestionAnswerRepository.findByIdAndDoctorId(
        answerId,
        existingDoctor.id
      )
    if (existingPatientQuestionAnswer == null) {
      throw new NotFoundError('Answer does not exist.')
    }
    try {
      await tx.start()
      const txExecutor = tx.getExecutor()

      await this.patientQuestionAnswerRepository.delete(
        existingPatientQuestionAnswer,
        txExecutor
      )
      await this.answerAgreementRepository.deleteAllByAnswerId(
        answerId,
        txExecutor
      )
      await this.answerAppreciationRepository.deleteAllByAnswerId(
        answerId,
        txExecutor
      )
      await tx.end()
      return {
        answerId,
      }
    } catch (error) {
      await tx.rollback()
      throw error
    }
  }
}
