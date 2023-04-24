import { WeightRecord } from '../../WeightRecord'

export interface IWeightRecordRepository {
  findById: (id: string) => Promise<WeightRecord | null>
  save: (user: WeightRecord) => Promise<void>
}
