import { INotificationRepository } from '../../domain/notification/interfaces/repositories/INotificationRepository'
import { User } from '../../domain/user/User'

interface DeleteAllNotificationsRequest {
  user: User
}

interface DeleteAllNotificationsResponse {
  deletedAt: Date
}

export class DeleteAllNotificationsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  public async execute(
    request: DeleteAllNotificationsRequest
  ): Promise<DeleteAllNotificationsResponse> {
    const { user } = request

    const existingNotifications =
      await this.notificationRepository.findAllByUserId(
        // 用user id 找出所有存在訊息
        user.id
      )

    if (existingNotifications == null) {
      throw new Error('No notification exits.')
    }

    await this.notificationRepository.deleteAllByUserId(user.id)

    return { deletedAt: new Date() }
  }
}
