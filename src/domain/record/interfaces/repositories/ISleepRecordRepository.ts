import { SleepRecord } from '../../SleepRecord'

export interface ISleepRecordRepository {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<SleepRecord | null>
  save: (sleepRecord: SleepRecord) => Promise<void>
}
