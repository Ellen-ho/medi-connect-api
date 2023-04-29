export interface IAnswerAgreementProps {
  id: string
  answerId: string
  agreedDoctorId: string
  comment: string | null
  createdAt: Date
  updatedAt: Date
}

export class AnswerAgreement {
  constructor(private readonly props: IAnswerAgreementProps) {}

  public get id(): string {
    return this.props.id
  }

  public get answerId(): string {
    return this.props.answerId
  }

  public get agreedDoctorId(): string {
    return this.props.agreedDoctorId
  }

  public get comment(): string | null {
    return this.props.comment
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public updateComment(comment: string): void {
    this.props.comment = comment
  }
}
