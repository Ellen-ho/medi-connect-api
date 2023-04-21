export interface IGlycatedHemoglobinRecordProps {
  id: string
  glycatedHemoglobinDate: Date
  glycatedHemoglobinValue: number
  glycatedHemoglobinUnit: GlycatedHemoglobinUnitType
  createdAt: Date
  updatedAt: Date
}

export enum GlycatedHemoglobinUnitType {
  PERCENT = '%',
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

  public get glycatedHemoglobinUnit(): GlycatedHemoglobinUnitType {
    return this.props.glycatedHemoglobinUnit
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
