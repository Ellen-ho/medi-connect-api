import { User } from '../user/User'

export interface INotificationProps {
  id: string
  isRead: boolean
  title: string
  content: string
  notificationType: NotificationType
  referenceId: string | null
  createdAt: Date
  updatedAt: Date
  user: User // 自己才可以看到自己的通知
}

export enum NotificationType {
  UPCOMING_APPOINTMENT = 'UPCOMING_APPOINTMENT', // reference_id = appointment ID
  CANCEL_APPOINTMENT = 'CANCEL_APPOINTMENT', // reference_id = appointment ID
  CREATE_APPOINTMENT = 'CREATE_APPOINTMENT', // reference_id = appointment ID
  HEALTH_GOAL_NOTIFICATION = 'HEALTH_GOAL_NOTIFICATION', // reference_id = health goal ID
  GET_ANSWER_NOTIFICATION = 'GET_ANSWER_NOTIFICATION', // reference_id = question ID
  THANK_YOU_NOTIFICATION = 'THANK_YOU_NOTIFICATION', // reference_id = answer ID
  AGREED_NOTIFICATION = 'AGREED_NOTIFICATION', // reference_id = answer ID
  CANCEL_OVERTIME_PENDING_GOAL = 'CANCEL_OVERTIME_PENDING_GOAL', // reference_id = health goal ID
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

  // The reference_id contains different ids based on the notification type

  public get referenceId(): string | null {
    return this.props.referenceId
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
