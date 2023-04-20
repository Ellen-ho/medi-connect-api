export interface IPatientProps {
  id: string
  avatar: string
  firstName: string
  lastName: string
  birthDate: string
  gender: string
  medicalHistory: string
  allergy: string
  familyHistory: string
}

export class Patient {
  constructor(private readonly props: IPatientProps) {}

  public get id(): string {
    return this.props.id
  }

  public get avatar(): string {
    return this.props.avatar
  }
}

