export interface IGlycatedHemoglobinRecordProps {
  id: string
  glycatedHemoglobinDate: Date
  glycatedHemoglobinValue: number
}

export class GlycatedHemoglobinRecord {
  constructor(private readonly props: IGlycatedHemoglobinRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get glycatedHemoglobinDate(): Date {
    return this.props.glycatedHemoglobinDate
  }

  public get glycatedHemoglobinValue(): number {
    return this.props.glycatedHemoglobinValue
  }
}
