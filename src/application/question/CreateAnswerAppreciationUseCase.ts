import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { NotificationType } from '../../domain/notification/Notification'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { AnswerAppreciation } from '../../domain/question/AnswerAppreciation'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { INotificationHelper } from '../notification/NotificationHelper'

interface CreateAnswerAppreciationRequest {
  user: User
  content: string | null
  answerId: string
}

interface CreateAnswerAppreciationResponse {
  id: string
  answerId: string
  totalThankCounts: number
  createdAt: Date
  updatedAt: Date
}

export class CreateAnswerAppreciationUseCase {
  constructor(
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly answerAppreciationRepository: IAnswerAppreciationRepository,
    private readonly uuidService: IUuidService,
    private readonly notifictionHelper: INotificationHelper,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: CreateAnswerAppreciationRequest
  ): Promise<CreateAnswerAppreciationResponse> {
    const { user, content, answerId } = request

    const existingAnswer = await this.patientQuestionAnswerRepository.findById(
      answerId
    )
    if (existingAnswer == null) {
      throw new NotFoundError('Answer does not exist.')
    }

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }
    const beAppreciatedDoctorId = existingAnswer.doctorId
    const beAppreciatedDoctor = await this.doctorRepository.findById(
      beAppreciatedDoctorId
    )
    if (beAppreciatedDoctor == null) {
      throw new AuthorizationError(
        'Cna not find the doctor who is be appreciated.'
      )
    }

    const answerAppreciation = new AnswerAppreciation({
      id: this.uuidService.generateUuid(),
      content,
      patient: existingPatient,
      createdAt: new Date(),
      updatedAt: new Date(),
      answer: existingAnswer,
    })
    await this.answerAppreciationRepository.save(answerAppreciation)

    await this.notifictionHelper.createNotification({
      title: 'Congratulations! You have received gratitude from a patient!',
      content:
        'Thank you for your professional and detailed response. The patient expressed gratitude upon receiving your answer.',
      notificationType: NotificationType.THANK_YOU_NOTIFICATION,
      user: beAppreciatedDoctor.user,
    })

    const totalThankCounts =
      await this.answerAppreciationRepository.countByAnswerId(answerId)

    return {
      id: answerAppreciation.id,
      answerId: existingAnswer.id,
      totalThankCounts,
      createdAt: answerAppreciation.createdAt,
      updatedAt: answerAppreciation.updatedAt,
    }
  }
}
