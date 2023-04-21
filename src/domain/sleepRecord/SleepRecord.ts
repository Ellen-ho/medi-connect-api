export interface ISleepRecordProps {
  id: string
  sleepDate: Date
  sleepTime: Date
  wakeUpTime: Date
  sleepQuality: SleepQualityType
  sleepDuration: number
  sleepNote: string | null
}

export enum SleepQualityType {
  'EXCELLENT' = 'EXCELLENT',
  'GOOD' = 'GOOD',
  'FAIR' = 'FAIR',
  'POOR' = 'POOR',
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

  public get sleepDuration(): number {
    return this.props.sleepDuration
  }

  public get sleepNote(): string | null {
    return this.props.sleepNote
  }
}
