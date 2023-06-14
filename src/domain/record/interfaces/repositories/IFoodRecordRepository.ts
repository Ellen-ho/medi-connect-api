import { IFoodRecordWithOwner } from '../../../../application/record/GetSingleFoodRecordUseCase'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { FoodCategoryType, FoodRecord } from '../../FoodRecord'

export interface IFoodRecordRepository extends IBaseRepository<FoodRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<FoodRecord | null>
  findRecordWithOwnerByRecordIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<IFoodRecordWithOwner | null>
  findAndCountAll: (
    limit: number,
    offset: number
  ) => Promise<{
    total_counts: number
    records: Array<{
      foodTime: Date
      foodCategory: FoodCategoryType
    }>
  }>
  findById: (id: string) => Promise<FoodRecord | null>
}
