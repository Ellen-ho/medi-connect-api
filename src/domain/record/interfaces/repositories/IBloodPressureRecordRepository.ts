import { IBaseRepository } from '../../../shared/IBaseRepository'
import { BloodPressureRecord } from '../../BloodPressureRecord'

export interface IBloodPressureRecordRepository
  extends IBaseRepository<BloodPressureRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<BloodPressureRecord | null>
}
