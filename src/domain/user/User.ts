export interface IUserProps {
  id: string
  email: string
  hashedPassword: string
  displayName: string
  createdAt: Date
  updatedAt: Date
}

export class User {
  constructor(private readonly props: IUserProps) {}

  public get id(): string {
    return this.props.id
  }

  public get displayName(): string {
    return this.props.displayName
  }

  public get email(): string {
    return this.props.email
  }

  public get hashedPassword(): string {
    return this.props.hashedPassword
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
