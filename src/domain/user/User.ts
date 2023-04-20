export interface IUserProps {
  id: string
  name: string
  email: string
  hashedPassword: string
}

export class User {
  constructor(private readonly props: IUserProps) {}

  public get id(): string {
    return this.props.id
  }

  public get name(): string {
    return this.props.name
  }

  public get email(): string {
    return this.props.email
  }

  public get hashedPassword(): string {
    return this.props.hashedPassword
  }
}