import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { User } from '../../domain/user/User'

interface EditPatientQuestionRequest {
  user: User
  patientQuestionId: string
  content: string
  medicalSpecialty: MedicalSpecialtyType
}

interface EditPatientQuestionResponse {
  id: string
  content: string
  medicalSpecialty: MedicalSpecialtyType
  updatedAt: Date
}

export class EditPatientQuestionUseCase {
  constructor(
    private readonly patientQuestionRepository: IPatientQuestionRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: EditPatientQuestionRequest
  ): Promise<EditPatientQuestionResponse> {
    const { user, patientQuestionId, content, medicalSpecialty } = request

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
      throw new Error('Answer agreement does not exist.')
    }

    existingPatientQuestion.updateData({ content, medicalSpecialty })

    await this.patientQuestionRepository.save(existingPatientQuestion)

    return {
      id: existingPatientQuestion.id,
      content: existingPatientQuestion.content,
      medicalSpecialty: existingPatientQuestion.medicalSpecialty,
      updatedAt: existingPatientQuestion.updatedAt,
    }
  }
}
