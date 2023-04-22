import { BloodPressureRecord } from '../../BloodPressureRecord'

export interface IBloodPressureRecordRepository {
  findById: (id: string) => Promise<BloodPressureRecord | null>
  save: (bloodPressureRecord: BloodPressureRecord) => Promise<void>
}
