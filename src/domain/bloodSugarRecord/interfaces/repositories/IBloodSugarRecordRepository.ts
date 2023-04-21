import { BloodSugarRecord } from '../../BloodSugarRecord'

export interface IBloodSugarRecordRepository {
  findById: (id: string) => Promise<BloodSugarRecord | null>
  save: (bloodSugarRecord: BloodSugarRecord) => Promise<void>
}
