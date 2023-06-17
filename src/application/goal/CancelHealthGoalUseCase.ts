import { HealthGoalStatus } from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { NotificationType } from '../../domain/notification/Notification'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
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
  ): Promise<CancelHealthGoalResponse> {
    const { user } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const currentDate = new Date()
    const edgeDate = currentDate.setDate(currentDate.getDate() - 3) // 當前日期减去三天

    const overThreeDaysPendingHealthGoals =
      await this.healthGoalRepository.findByPatientIdAndStatusAndDateEdge(
        existingPatient.id,
        [HealthGoalStatus.PENDING],
        new Date(edgeDate)
      )

    if (overThreeDaysPendingHealthGoals.length === 0) {
      throw new Error('There are no over time pending health goals exist.')
    }

    for (const healthGoal of overThreeDaysPendingHealthGoals) {
      await this.healthGoalRepository.deleteById(healthGoal.id)
    }

    await this.notifictionHelper.createNotification({
      title: 'One of your appointments has been canceled.',
      content:
        'One of your appointments has been canceled.Please take a moment to review and confirm your appointment schedule.',
      notificationType: NotificationType.CANCEL_OVERTIME_PENDING_GOAL,
      user: existingPatient.user,
    })

    return { deletedAt: new Date() }
  }
}