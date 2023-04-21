export interface IBloodSugarRecordProps {
  id: string
  bloodSugarDate: Date
  bloodSugarValue: number
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

  public get bloodSugarNote(): string | null {
    return this.props.bloodSugarNote
  }
}
