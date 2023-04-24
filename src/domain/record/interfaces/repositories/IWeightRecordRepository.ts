import { WeightRecord } from '../../WeightRecord'

export interface IWeightRecordRepository {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<WeightRecord | null>
  save: (user: WeightRecord) => Promise<void>
}
