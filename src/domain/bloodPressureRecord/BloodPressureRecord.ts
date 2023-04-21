export interface IBloodPressureRecordProps {
  id: string
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class BloodPressureRecord {
  constructor(private readonly props: IBloodPressureRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get bloodPressureDate(): Date {
    return this.props.bloodPressureDate
  }

  public get systolicBloodPressure(): number {
    return this.props.systolicBloodPressure
  }

  public get diastolicBloodPressure(): number {
    return this.props.diastolicBloodPressure
  }

  public get heartBeat(): number {
    return this.props.heartBeat
  }

  public get bloodPressureNote(): string | null {
    return this.props.bloodPressureNote
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
