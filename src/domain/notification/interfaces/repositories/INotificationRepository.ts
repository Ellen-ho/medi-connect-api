import { IBaseRepository } from '../../../shared/IBaseRepository'
import { Notification, NotificationType } from '../../Notification'

export interface INotificationRepository extends IBaseRepository<Notification> {
  findByIdAndUserId: (
    notificationId: string,
    userId: string
  ) => Promise<Notification | null>
  findByUserIdAndCountAll: (
    userId: string,
    limit: number,
    offset: number
  ) => Promise<{
    total_counts: number
    notifications: Array<{
      id: string
      title: string
      content: string
      isRead: boolean
      notificationType: NotificationType
      createdAt: Date
      updatedAt: Date
    }>
  }>
  findUnreadByUserId: (userId: string) => Promise<boolean>
  findAllUnreadNotificationsByUserId: (
    userId: string
  ) => Promise<Notification[]>
  saveAll: (notifications: Notification[]) => Promise<void>
}
