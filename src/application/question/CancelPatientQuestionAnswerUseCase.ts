import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { User } from '../../domain/user/User'

interface CancelPatientQuestionAnswerRequest {
  user: User
  content: string
  patientQuestionAnswerId: string
}

interface CancelPatientQuestionAnswerResponse {
  totalThankCounts: number
  totalAgreedDoctorCounts: number
  agreedDoctorAvatars: Array<string | null>
}

export class CancelPatientQuestionAnswerUseCase {
  constructor(
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly answerAppreciationRepository: IAnswerAppreciationRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: CancelPatientQuestionAnswerRequest
  ): Promise<CancelPatientQuestionAnswerResponse> {
    const { user, patientQuestionAnswerId } = request

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const existingPatientQuestionAnswer =
      await this.patientQuestionAnswerRepository.findByIdAndDoctorId(
        patientQuestionAnswerId,
        existingDoctor.id
      )
    if (existingPatientQuestionAnswer == null) {
      throw new Error('Answer does not exist.')
    }

    await this.patientQuestionAnswerRepository.deleteById(
      existingPatientQuestionAnswer.id
    )

    const totalThankCounts =
      await this.answerAppreciationRepository.countByAnswerId(answerId)

    return {
      totalThankCounts,
      totalAgreedDoctorCounts,
      agreedDoctorAvatars,
    }
  }
}
