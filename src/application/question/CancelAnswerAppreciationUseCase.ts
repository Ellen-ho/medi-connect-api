import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { NotificationType } from '../../domain/notification/Notification'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { INotificationHelper } from '../notification/NotificationHelper'

interface CancelAnswerAppreciationRequest {
  user: User
  answerId: string
}

interface CancelAnswerAppreciationResponse {
  totalThankCounts: number
}

export class CancelAnswerAppreciationUseCase {
  constructor(
    private readonly answerAppreciationRepository: IAnswerAppreciationRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly notifictionHelper: INotificationHelper
  ) {}

  public async execute(
    request: CancelAnswerAppreciationRequest
  ): Promise<CancelAnswerAppreciationResponse> {
    const { user, answerId } = request

    const existingAnswer = await this.patientQuestionAnswerRepository.findById(
      answerId
    )
    if (existingAnswer == null) {
      throw new NotFoundError('Answer does not exist.')
    }

    const beThankedDoctor = await this.doctorRepository.findById(
      existingAnswer.doctorId
    )
    if (beThankedDoctor == null) {
      throw new AuthorizationError(
        'There is no doctor who has been thanked upon.'
      )
    }

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const existingAnswerAppreciation =
      await this.answerAppreciationRepository.findByAnswerIdAndPatientId(
        answerId,
        existingPatient.id
      )
    if (existingAnswerAppreciation == null) {
      throw new NotFoundError('Answer appreciation does not exist.')
    }

    await this.answerAppreciationRepository.delete(existingAnswerAppreciation)

    await this.notifictionHelper.createNotification({
      title: 'One of your appreciations has been canceled.',
      content: 'One of your appreciations has been canceled.',
      notificationType: NotificationType.APPRECIATION_BE_CANCELED_NOTIFICATION,
      referenceId: existingAnswer.id,
      user: beThankedDoctor.user,
    })

    const totalThankCounts =
      await this.answerAppreciationRepository.countByAnswerId(
        existingAnswerAppreciation.answer.id
      )

    return {
      totalThankCounts,
    }
  }
}
