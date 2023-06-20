import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import {
  MedicalSpecialtyType,
  PatientQuestion,
} from '../../domain/question/PatientQuestion'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'

interface CreatePatientQuestionRequest {
  user: User
  content: string
  medicalSpecialty: MedicalSpecialtyType
}

interface CreatePatientQuestionResponse {
  id: string
  content: string
  medicalSpecialty: MedicalSpecialtyType
  createdAt: Date
  updatedAt: Date
}

export class CreatePatientQuestionUseCase {
  constructor(
    private readonly patientQuestionRepository: IPatientQuestionRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreatePatientQuestionRequest
  ): Promise<CreatePatientQuestionResponse> {
    const { user, content, medicalSpecialty } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const patientQuestion = new PatientQuestion({
      id: this.uuidService.generateUuid(),
      content,
      medicalSpecialty,
      createdAt: new Date(),
      updatedAt: new Date(),
      askerId: existingPatient.id,
    })
    await this.patientQuestionRepository.save(patientQuestion)

    return {
      id: patientQuestion.id,
      content: patientQuestion.content,
      medicalSpecialty: patientQuestion.medicalSpecialty,
      createdAt: patientQuestion.createdAt,
      updatedAt: patientQuestion.updatedAt,
    }
  }
}
