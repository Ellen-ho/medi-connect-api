import { FoodRecord } from '../../FoodRecord'

export interface IFoodRecordRepository {
  findById: (id: string) => Promise<FoodRecord | null>
  save: (foodRecord: FoodRecord) => Promise<void>
}
