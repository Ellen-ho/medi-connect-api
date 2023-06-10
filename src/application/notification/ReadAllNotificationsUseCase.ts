import { NotificationType } from '../../domain/notification/Notification'
import { INotificationRepository } from '../../domain/notification/interfaces/repositories/INotificationRepository'
import { User } from '../../domain/user/User'

interface ReadAllNotificationsRequest {
  user: User
}

interface ReadAllNotificationsResponse {
  updatedNotifications: Array<{
    id: string
    title: string
    content: string
    isRead: boolean
    notificationType: NotificationType
    createdAt: Date
    updatedAt: Date
  }>
}

export class ReadAllNotificationsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  public async execute(
    request: ReadAllNotificationsRequest
  ): Promise<ReadAllNotificationsResponse> {
    const { user } = request

    const existingUnReadNotifications =
      await this.notificationRepository.findAllUnreadNotificationsByUserId(
        // 用user id 找出所有未讀訊息
        user.id
      )

    if (existingUnReadNotifications == null) {
      throw new Error('All notifications have been read.')
    }

    existingUnReadNotifications.forEach((notification) => {
      notification.updateIsRead(true)
    })

    await this.notificationRepository.saveAll(existingUnReadNotifications)

    return {
      updatedNotifications: existingUnReadNotifications.map((notification) => ({
        id: notification.id,
        title: notification.title,
        content: notification.content,
        isRead: notification.isRead,
        notificationType: notification.notificationType,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      })),
    }
  }
}
