import { User } from '../user/User'

export interface INotificationProps {
  id: string
  isRead: boolean
  title: string
  content: string
  notificationType: NotificationType
  createdAt: Date
  updatedAt: Date
  user: User // 自己才可以看到自己的通知
}

export enum NotificationType {
  UPCOMING_APPOINTMENT = 'UPCOMING_APPOINTMENT',
  CANCEL_APPOINTMENT = 'CANCEL_APPOINTMENT',
  CREATE_APPOINTMENT = 'CREATE_APPOINTMENT',
  HEALTH_GOAL_NOTIFICATION = 'HEALTH_GOAL_NOTIFICATION',
  GET_ANSWER_NOTIFICATION = 'GET_ANSWER_NOTIFICATION',
  THANK_YOU_NOTIFICATION = 'THANK_YOU_NOTIFICATION',
  AGREED_NOTIFICATION = 'AGREED_NOTIFICATION',
  CANCEL_OVERTIME_PENDING_GOAL = 'CANCEL_OVERTIME_PENDING_GOAL',
}

export class Notification {
  constructor(private readonly props: INotificationProps) {}

  public get id(): string {
    return this.props.id
  }

  public get isRead(): boolean {
    return this.props.isRead
  }

  public get title(): string {
    return this.props.title
  }

  public get content(): string {
    return this.props.content
  }

  public get notificationType(): NotificationType {
    return this.props.notificationType
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get user(): User {
    return this.props.user
  }

  public updateIsRead(isRead: boolean): void {
    this.props.isRead = isRead
  }
}
