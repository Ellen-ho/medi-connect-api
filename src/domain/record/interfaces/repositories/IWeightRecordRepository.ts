import { IBaseRepository } from '../../../shared/IBaseRepository'
import { WeightRecord } from '../../WeightRecord'

export interface IWeightRecordRepository extends IBaseRepository<WeightRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<WeightRecord | null>
}
