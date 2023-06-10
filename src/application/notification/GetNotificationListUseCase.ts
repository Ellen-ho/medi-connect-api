import { NotificationType } from '../../domain/notification/Notification'
import { INotificationRepository } from '../../domain/notification/interfaces/repositories/INotificationRepository'
import { User } from '../../domain/user/User'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetNotificationListsRequest {
  user: User
  page?: number
  limit?: number
}

interface GetNotificationListsResponse {
  data: Array<{
    id: string
    title: string
    isRead: boolean
    content: string
    notificationType: NotificationType
    createdAt: Date
    updatedAt: Date
  }> | null
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}

export class GetNotificationListsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  public async execute(
    request: GetNotificationListsRequest
  ): Promise<GetNotificationListsResponse> {
    const { user } = request
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingNotificationLists =
      await this.notificationRepository.findByUserIdAndCountAll(
        user.id,
        limit,
        offset
      )

    if (existingNotificationLists == null) {
      throw new Error('NotificationLists do not exist.')
    }

    return {
      data: existingNotificationLists.notifications,
      pagination: getPagination(
        limit,
        page,
        existingNotificationLists.total_counts
      ),
    }
  }
}
