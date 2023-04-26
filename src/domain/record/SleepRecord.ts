import { Patient } from '../patient/Patient'

export interface ISleepRecordProps {
  id: string
  sleepDate: Date
  sleepTime: Date
  wakeUpTime: Date
  sleepQuality: SleepQualityType
  sleepDurationHour: number
  sleepNote: string | null
  createdAt: Date
  updatedAt: Date
  patient: Patient
}

export enum SleepQualityType {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
}

interface ISleepRecordUpdateData {
  [key: string]: any
  sleepDate: Date
  sleepTime: Date
  wakeUpTime: Date
  sleepQuality: SleepQualityType
  sleepDurationHour: number
  sleepNote: string | null
}
export class SleepRecord {
  constructor(private readonly props: ISleepRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get sleepDate(): Date {
    return this.props.sleepDate
  }

  public get sleepTime(): Date {
    return this.props.sleepTime
  }

  public get wakeUpTime(): Date {
    return this.props.wakeUpTime
  }

  public get sleepQuality(): SleepQualityType {
    return this.props.sleepQuality
  }

  public get sleepDurationHour(): number {
    return this.props.sleepDurationHour
  }

  public get sleepNote(): string | null {
    return this.props.sleepNote
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

  public updateData(data: ISleepRecordUpdateData): void {
    this.props.sleepDate = data.sleepDate
    this.props.sleepTime = data.sleepTime
    this.props.wakeUpTime = data.wakeUpTime
    this.props.sleepQuality = data.sleepQuality
    this.props.sleepDurationHour = data.sleepDurationHour
    this.props.sleepNote = data.sleepNote
  }
}