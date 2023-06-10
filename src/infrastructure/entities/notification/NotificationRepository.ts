import { DataSource } from 'typeorm'
import {
  Notification,
  NotificationType,
} from '../../../domain/notification/Notification'
import { INotificationRepository } from '../../../domain/notification/interfaces/repositories/INotificationRepository'
import { BaseRepository } from '../../database/BaseRepository'
import { NotificationEntity } from './NotificationEntity'
import { NotificationMapper } from './NotificationMapper'
import { RepositoryError } from '../../error/RepositoryError'

export class NotificationRepository
  extends BaseRepository<NotificationEntity, Notification>
  implements INotificationRepository
{
  constructor(dataSource: DataSource) {
    super(NotificationEntity, new NotificationMapper(), dataSource)
  }

  public async findByIdAndUserId(
    notificationId: string,
    userId: string
  ): Promise<Notification | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: notificationId,
          user: { id: userId }, // need to set @RelationId
        },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'NotificationRepository findByIdAndUserId error',
        e as Error
      )
    }
  }

  public async findByUserIdAndCountAll(
    userId: string,
    limit: number,
    offset: number
  ): Promise<{
    total_counts: number
    notifications: Array<{
      id: string
      title: string
      isRead: boolean
      notificationType: NotificationType
      createdAt: Date
      updatedAt: Date
    }>
  }> {
    try {
      const rawNotifications = await this.getQuery<
        Array<{
          total_counts: number
          id: string
          title: string
          is_read: boolean
          notification_type: NotificationType
          created_at: Date
          updated_at: Date
        }>
      >(
        `
          SELECT
            (SELECT COUNT(*) FROM notifications WHERE user_id = $1) as total_counts,
            id,
            title,
            is_read,
            notification_type,
            created_at,
            updated_at
          FROM
            notifications
            WHERE
          user_id = $1
          ORDER BY created_at DESC
          LIMIT $2
          OFFSET $3
        `,
        [userId, limit, offset]
      )

      return {
        total_counts: rawNotifications[0].total_counts,
        notifications: rawNotifications.map((notification) => ({
          id: notification.id,
          title: notification.title,
          isRead: notification.is_read,
          notificationType: notification.notification_type,
          createdAt: notification.created_at,
          updatedAt: notification.updated_at,
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'NotificationRepository findAndCountAll error',
        e as Error
      )
    }
  }

  public async findUnreadByUserId(userId: string): Promise<boolean> {
    try {
      const result = await this.getQuery<
        Array<{
          is_read: boolean
        }>
      >(
        `
          SELECT EXISTS (
            SELECT 1
            FROM notifications
            WHERE user_id = $1
            AND is_read = FALSE
            LIMIT 1
          ) AS has_unread_notification
          `,
        [userId]
      )
      return result[0].is_read
    } catch (e) {
      throw new RepositoryError(
        'NotificationRepository findUnreadByUserId error',
        e as Error
      )
    }
  }
}
