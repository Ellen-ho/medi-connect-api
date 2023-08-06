import { INotificationRepository } from '../../domain/notification/interfaces/repositories/INotificationRepository'
import { User } from '../../domain/user/User'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface DeleteNotificationRequest {
  user: User
  notificationId: string
}

interface DeleteNotificationResponse {
  deletedAt: Date
}

export class DeleteNotificationUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  public async execute(
    request: DeleteNotificationRequest
  ): Promise<DeleteNotificationResponse> {
    const { notificationId, user } = request

    const existingNotification =
      await this.notificationRepository.findByIdAndUserId(
        // 用user id 找出要刪除的特定訊息訊息
        notificationId,
        user.id
      )

    if (existingNotification == null) {
      throw new NotFoundError('The notification does not exits.')
    }

    await this.notificationRepository.delete(existingNotification)

    return { deletedAt: new Date() }
  }
}
