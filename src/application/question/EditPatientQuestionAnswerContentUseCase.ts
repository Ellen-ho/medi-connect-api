import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface EditPatientQuestionAnswerContentRequest {
  user: User
  content: string
  patientQuestionAnswerId: string
}

interface EditPatientQuestionAnswerContentResponse {
  id: string
  content: string
  updatedAt: Date
}

export class EditPatientQuestionAnswerContentUseCase {
  constructor(
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: EditPatientQuestionAnswerContentRequest
  ): Promise<EditPatientQuestionAnswerContentResponse> {
    const { user, content, patientQuestionAnswerId } = request

    if (content == null) {
      throw new ValidationError('Content cannot be empty')
    }

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const existingPatientQuestionAnswer =
      await this.patientQuestionAnswerRepository.findByIdAndDoctorId(
        patientQuestionAnswerId,
        existingDoctor.id
      )

    if (existingPatientQuestionAnswer == null) {
      throw new NotFoundError('Answer does not exist.')
    }

    existingPatientQuestionAnswer.updateContent(content)

    await this.patientQuestionAnswerRepository.save(
      existingPatientQuestionAnswer
    )

    return {
      id: existingPatientQuestionAnswer.id,
      content,
      updatedAt: existingPatientQuestionAnswer.updatedAt,
    }
  }
}
