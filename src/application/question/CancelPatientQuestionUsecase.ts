import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { User } from '../../domain/user/User'

interface CancelPatientQuestionRequest {
  user: User
  content: string
  medicalSpecialty: MedicalSpecialtyType
  patientQuestionId: string
}

interface CancelPatientQuestionResponse {
  totalThankCounts: number
  totalAgreedDoctorCounts: number
  agreedDoctorAvatars: Array<string | null>
}

export class CancelPatientQuestionUseCase {
  constructor(
    private readonly patientQuestionRepository: IPatientQuestionRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly answerAppreciationRepository: IAnswerAppreciationRepository
  ) {}

  public async execute(
    request: CancelPatientQuestionRequest
  ): Promise<CancelPatientQuestionResponse> {
    const { user, content, medicalSpecialty, patientQuestionId } = request

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

    await this.patientQuestionRepository.deleteById(existingPatientQuestion.id)

    const totalThankCounts =
      await this.answerAppreciationRepository.countByAnswerId(answerId)

    return {
      totalThankCounts,
      totalAgreedDoctorCounts,
      agreedDoctorAvatars,
    }
  }
}
