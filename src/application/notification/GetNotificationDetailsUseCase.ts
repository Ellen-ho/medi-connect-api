import { NotificationType } from '../../domain/notification/Notification'
import { INotificationRepository } from '../../domain/notification/interfaces/repositories/INotificationRepository'
import { User } from '../../domain/user/User'

interface GetNotificationDetailsRequest {
  user: User
  notificationId: string
}

interface GetNotificationDetailsResponse {
  id: string
  isRead: boolean
  title: string
  notificationType: NotificationType
  content: string
  createdAt: Date
  updatedAt: Date
}

export class GetNotificationDetailsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  public async execute(
    request: GetNotificationDetailsRequest
  ): Promise<GetNotificationDetailsResponse> {
    const { user, notificationId } = request

    const existingNotification =
      await this.notificationRepository.findByIdAndUserId(
        user.id,
        notificationId
      )

    if (existingNotification == null) {
      throw new Error('This notification does not exist.')
    }

    existingNotification.updateIsRead(true)

    await this.notificationRepository.save(existingNotification)

    return {
      id: existingNotification.id,
      isRead: existingNotification.isRead,
      title: existingNotification.title,
      notificationType: existingNotification.notificationType,
      content: existingNotification.content,
      createdAt: existingNotification.createdAt,
      updatedAt: existingNotification.updatedAt,
    }
  }
}