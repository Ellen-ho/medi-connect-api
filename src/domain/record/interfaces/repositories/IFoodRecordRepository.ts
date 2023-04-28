import { IBaseRepository } from '../../../shared/IBaseRepository'
import { FoodRecord } from '../../FoodRecord'

export interface IFoodRecordRepository extends IBaseRepository<FoodRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<FoodRecord | null>
}
