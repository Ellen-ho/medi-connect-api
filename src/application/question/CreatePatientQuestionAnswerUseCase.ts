import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { NotificationType } from '../../domain/notification/Notification'
import { PatientQuestionAnswer } from '../../domain/question/PatientQuestionAnswer'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { INotificationHelper } from '../notification/NotificationHelper'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

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
    private readonly uuidService: IUuidService,
    private readonly notifictionHelper: INotificationHelper,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: CreatePatientQuestionAnswerRequest
  ): Promise<CreatePatientQuestionAnswerResponse> {
    const { user, content, patientQuestionId } = request

    const existingPatientQuestion =
      await this.patientQuestionRepository.findById(patientQuestionId)

    if (existingPatientQuestion == null) {
      throw new AuthorizationError('Patient question does not exist.')
    }

    const patientWhoAsk = await this.patientRepository.findById(
      existingPatientQuestion.askerId
    )

    if (patientWhoAsk == null) {
      throw new AuthorizationError('Patient who asks does not exist.')
    }

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const existingPatientQuestionAnswer =
      await this.patientQuestionAnswerRepository.findByQuestionIdAndDoctorId(
        patientQuestionId,
        existingDoctor.id
      )

    if (existingPatientQuestionAnswer !== null) {
      throw new ValidationError('You have already answered this question.')
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

    await this.notifictionHelper.createNotification({
      title:
        'Hi, the question you asked has received an answer! You can go and take a look. !',
      content:
        'Thank you for your question. A professional doctor has provided an answer to your inquiry.',
      notificationType: NotificationType.GET_ANSWER_NOTIFICATION,
      user: patientWhoAsk.user,
    })

    return {
      id: patientQuestionAnswer.id,
      content: patientQuestionAnswer.content,
      patientQuestionId: existingPatientQuestion.id,
      createdAt: patientQuestionAnswer.createdAt,
      updatedAt: patientQuestionAnswer.updatedAt,
    }
  }
}
