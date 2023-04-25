import { BloodPressureRecord } from '../../BloodPressureRecord'

export interface IBloodPressureRecordRepository {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<BloodPressureRecord | null>
  save: (user: BloodPressureRecord) => Promise<void>
}
