import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IRepositoryTx } from '../../domain/shared/IRepositoryTx'
import { User } from '../../domain/user/User'

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
    private readonly doctorRepository: IDoctorRepository,
    private readonly tx: IRepositoryTx
  ) {}

  public async execute(
    request: CancelPatientQuestionAnswerRequest
  ): Promise<CancelPatientQuestionAnswerResponse> {
    const { user, answerId } = request

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const existingPatientQuestionAnswer =
      await this.patientQuestionAnswerRepository.findByIdAndDoctorId(
        answerId,
        existingDoctor.id
      )
    if (existingPatientQuestionAnswer == null) {
      throw new Error('Answer does not exist.')
    }
    try {
      await this.tx.start()

      await this.patientQuestionAnswerRepository.deleteById(
        existingPatientQuestionAnswer.id
      )
      await this.answerAgreementRepository.deleteAllByAnswerId(answerId)
      await this.answerAppreciationRepository.deleteAllByAnswerId(answerId)
      await this.tx.end()
      return {
        answerId,
      }
    } catch (error) {
      await this.tx.rollback()
      throw error
    }
  }
}
