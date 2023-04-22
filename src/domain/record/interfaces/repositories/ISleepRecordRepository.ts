import { SleepRecord } from '../../SleepRecord'

export interface ISleepRecordRepository {
  findById: (id: string) => Promise<SleepRecord | null>
  save: (user: SleepRecord) => Promise<void>
}
