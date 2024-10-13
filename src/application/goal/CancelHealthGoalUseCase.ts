import { HealthGoalStatus } from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { NotificationType } from '../../domain/notification/Notification'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { INotificationHelper } from '../notification/NotificationHelper'

interface CancelHealthGoalRequest {
  user: User
}

interface CancelHealthGoalResponse {
  deletedAt: Date
}

export class CancelHealthGoalUseCase {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly healthGoalRepository: IHealthGoalRepository,
    private readonly notifictionHelper: INotificationHelper
  ) {}

  public async execute(
    request: CancelHealthGoalRequest
  ): Promise<CancelHealthGoalResponse | null> {
    const { user } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const currentDate = new Date()
    const edgeDate = currentDate.setDate(currentDate.getDate() - 3)

    const overThreeDaysPendingHealthGoals =
      await this.healthGoalRepository.findByPatientIdAndStatusAndDateEdge(
        existingPatient.id,
        [HealthGoalStatus.PENDING],
        new Date(edgeDate)
      )

    if (overThreeDaysPendingHealthGoals.length === 0) {
      return null
    }

    for (const healthGoal of overThreeDaysPendingHealthGoals) {
      await this.healthGoalRepository.delete(healthGoal)
      await this.notifictionHelper.createNotification({
        title: 'One of your appointments has been canceled.',
        content:
          'One of your appointments has been canceled.Please take a moment to review and confirm your appointment schedule.',
        notificationType: NotificationType.CANCEL_OVERTIME_PENDING_GOAL,
        referenceId: healthGoal.id,
        user: existingPatient.user,
      })
    }

    return { deletedAt: new Date() }
  }
}
