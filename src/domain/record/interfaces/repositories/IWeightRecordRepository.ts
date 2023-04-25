import { WeightRecord } from '../../WeightRecord'

export interface IWeightRecordRepository {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<WeightRecord | null>
  save: (weightRecord: WeightRecord) => Promise<void>
}
