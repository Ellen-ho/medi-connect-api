import { Patient } from '../patient/Patient'

export interface IGlycatedHemoglobinRecordProps {
  id: string
  glycatedHemoglobinDate: Date
  glycatedHemoglobinValuePercent: number
  createdAt: Date
  updatedAt: Date
  patient: Patient
}
export class GlycatedHemoglobinRecord {
  constructor(private readonly props: IGlycatedHemoglobinRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get glycatedHemoglobinDate(): Date {
    return this.props.glycatedHemoglobinDate
  }

  public get glycatedHemoglobinValuePercent(): number {
    return this.props.glycatedHemoglobinValuePercent
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get patient(): Patient {
    return this.props.patient
  }
}
