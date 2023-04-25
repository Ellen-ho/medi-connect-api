import { Patient } from '../patient/Patient'

export interface IBloodPressureRecordProps {
  id: string
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
  createdAt: Date
  updatedAt: Date
  patient: Patient
}

interface IBloodPressureRecordUpdateData {
  [key: string]: any
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
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

  public get patient(): Patient {
    return this.props.patient
  }

  public updateData(data: IBloodPressureRecordUpdateData): void {
    this.props.bloodPressureDate = data.bloodPressureDate
    this.props.systolicBloodPressure = data.systolicBloodPressure
    this.props.diastolicBloodPressure = data.diastolicBloodPressure
    this.props.heartBeat = data.heartBeat
    this.props.bloodPressureNote = data.bloodPressureNote
  }
}
