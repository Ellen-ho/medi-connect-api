export interface IBloodSugarRecordProps {
  id: string
  bloodSugarDate: Date
  bloodSugarValue: number
  bloodSugarType: BloodSugarType
  bloodSugarNote: string | null
  createdAt: Date
  updatedAt: Date
  patientId: string
}

export enum BloodSugarType {
  FAST_SUGAR_GLUCOSE = 'FAST_SUGAR_GLUCOS',
  POSTPRANDIAL_BLOOD_GLUCOSE = 'POSTPRANDIAL_BLOOD_GLUCOS',
}

interface IBloodSugarRecordUpdateData {
  [key: string]: any
  bloodSugarDate: Date
  bloodSugarValue: number // mg/dl
  bloodSugarType: BloodSugarType
  bloodSugarNote: string | null
}
export class BloodSugarRecord {
  constructor(private readonly props: IBloodSugarRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get bloodSugarDate(): Date {
    return this.props.bloodSugarDate
  }

  public get bloodSugarValue(): number {
    return this.props.bloodSugarValue
  }

  public get bloodSugarType(): BloodSugarType {
    return this.props.bloodSugarType
  }

  public get bloodSugarNote(): string | null {
    return this.props.bloodSugarNote
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get patientId(): string {
    return this.props.patientId
  }

  public updateData(data: IBloodSugarRecordUpdateData): void {
    this.props.bloodSugarDate = data.bloodSugarDate
    this.props.bloodSugarValue = data.bloodSugarValue
    this.props.bloodSugarType = data.bloodSugarType
    this.props.bloodSugarNote = data.bloodSugarNote
  }
}
