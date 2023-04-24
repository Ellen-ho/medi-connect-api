import { Patient } from '../patient/Patient'

export interface IBloodSugarRecordProps {
  id: string
  bloodSugarDate: Date
  bloodSugarValueMmo: number
  bloodSugarNote: string | null
  createdAt: Date
  updatedAt: Date
  patient: Patient
}
export class BloodSugarRecord {
  constructor(private readonly props: IBloodSugarRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get bloodSugarDate(): Date {
    return this.props.bloodSugarDate
  }

  public get bloodSugarValueMmo(): number {
    return this.props.bloodSugarValueMmo
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

  public get patient(): Patient {
    return this.props.patient
  }
}
