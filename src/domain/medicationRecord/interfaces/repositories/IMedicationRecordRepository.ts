import { User } from '../../User'

export interface IMedicationRecordRepository {
  findById: (id: string) => Promise<MedicationRecord | null>
  save: (medicationRecord: MedicationRecord) => Promise<void>
}
