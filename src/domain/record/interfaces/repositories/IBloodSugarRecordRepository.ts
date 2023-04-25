import { BloodSugarRecord } from '../../BloodSugarRecord'

export interface IBloodSugarRecordRepository {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<BloodSugarRecord | null>
  save: (bloodSugarRecord: BloodSugarRecord) => Promise<void>
}
