import { FoodRecord } from '../../FoodRecord'

export interface IFoodRecordRepository {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<FoodRecord | null>
  save: (foodRecord: FoodRecord) => Promise<void>
}
