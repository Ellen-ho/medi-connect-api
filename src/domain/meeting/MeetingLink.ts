export interface IMeetingLinkProps {
  id: string
  link: string
  status: MeetingLinkStatus
  createdAt: Date
  updatedAt: Date
}

export enum MeetingLinkStatus {
  IN_USED = 'IN_USED',
  AVAILABLE = 'AVAILABLE',
}

export class MeetingLink {
  constructor(private readonly props: IMeetingLinkProps) {}

  public get id(): string {
    return this.props.id
  }

  public get link(): string {
    return this.props.link
  }

  public get status(): MeetingLinkStatus {
    return this.props.status
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
