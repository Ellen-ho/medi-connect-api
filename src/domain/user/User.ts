export interface IUserProps {
  id: string
  email: string
  hashedPassword: string
  displayName: string
  role: UserRoleType
  createdAt: Date
  updatedAt: Date
}

export enum UserRoleType {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
}

interface IUserUpdateData {
  displayName: string
  password: string
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

  public get role(): UserRoleType {
    return this.props.role
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public updateData(data: IUserUpdateData): void {
    this.props.displayName = data.displayName
    this.props.hashedPassword = data.password
  }
}
