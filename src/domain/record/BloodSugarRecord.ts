import { Patient } from '../patient/Patient'

export interface IBloodSugarRecordProps {
  id: string
  bloodSugarDate: Date
  bloodSugarValueMmo: number // mmol/L
  bloodSugarNote: string | null
  createdAt: Date
  updatedAt: Date
  patient: Patient
}

interface IBloodSugarRecordUpdateData {
  [key: string]: any
  bloodSugarDate: Date
  bloodSugarValueMmo: number // mmol/L
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

  public updateData(data: IBloodSugarRecordUpdateData): void {
    this.props.bloodSugarDate = data.bloodSugarDate
    this.props.bloodSugarValueMmo = data.bloodSugarValueMmo
    this.props.bloodSugarNote = data.bloodSugarNote
  }
}
