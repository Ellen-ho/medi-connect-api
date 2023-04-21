export interface IBloodSugarRecordProps {
  id: string
  bloodSugarDate: Date
  bloodSugarValue: number
  bloodSugarNote: string | null
  bloodSugarUnit: BloodSugarUnitType
  createdAt: Date
  updatedAt: Date
}

export enum BloodSugarUnitType {
  MG_PER_DL = 'mg/dl',
  MMO_PER_L = 'mmol/L',
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

  public get bloodSugarNote(): string | null {
    return this.props.bloodSugarNote
  }

  public get bloodSugarUnit(): BloodSugarUnitType {
    return this.props.bloodSugarUnit
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
