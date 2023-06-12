import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'
import { NotificationType } from '../../../domain/notification/Notification'
import { UserEntity } from '../user/UserEntity'

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'is_read', type: 'boolean', default: false })
  public isRead!: boolean

  @Column({ name: 'title', type: 'varchar', length: 100 })
  public title!: string

  @Column({ name: 'content', type: 'text' })
  public content!: string

  @Column({ name: 'notification_type', type: 'text' })
  public notificationType!: NotificationType

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt?: Date

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  public user!: UserEntity

  @Column({ name: 'user_id' })
  @RelationId((notification: NotificationEntity) => notification.user)
  public userId!: string
}
