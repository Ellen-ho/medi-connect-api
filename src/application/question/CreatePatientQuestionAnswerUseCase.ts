import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { PatientQuestionAnswer } from '../../domain/question/PatientQuestionAnswer'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreatePatientQuestionAnswerRequest {
  user: User
  content: string
  patientQuestionId: string
}

interface CreatePatientQuestionAnswerResponse {
  id: string
  content: string
  patientQuestionId: string
  createdAt: Date
  updatedAt: Date
}

export class CreatePatientQuestionAnswerUseCase {
  constructor(
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly patientQuestionRepository: IPatientQuestionRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreatePatientQuestionAnswerRequest
  ): Promise<CreatePatientQuestionAnswerResponse> {
    const { user, content, patientQuestionId } = request

    const existingPatientQuestion =
      await this.patientQuestionRepository.findById(patientQuestionId)

    if (existingPatientQuestion == null) {
      throw new Error('Patient question does not exist.')
    }

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const existingPatientQuestionAnswer =
      await this.patientQuestionAnswerRepository.findByQuestionIdAndDoctorId(
        patientQuestionId,
        existingDoctor.id
      )

    if (existingPatientQuestionAnswer !== null) {
      throw new Error('You have already answered this question.')
    }

    const patientQuestionAnswer = new PatientQuestionAnswer({
      id: this.uuidService.generateUuid(),
      content,
      patientQuestionId: existingPatientQuestion.id,
      doctorId: existingDoctor.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await this.patientQuestionAnswerRepository.save(patientQuestionAnswer)

    return {
      id: patientQuestionAnswer.id,
      content: patientQuestionAnswer.content,
      patientQuestionId: existingPatientQuestion.id,
      createdAt: patientQuestionAnswer.createdAt,
      updatedAt: patientQuestionAnswer.updatedAt,
    }
  }
}
