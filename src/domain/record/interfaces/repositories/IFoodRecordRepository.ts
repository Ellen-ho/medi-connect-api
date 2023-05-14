import { IFoodRecordWithOwner } from '../../../../application/record/GetSingleFoodRecordUseCase'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { FoodRecord } from '../../FoodRecord'

export interface IFoodRecordRepository extends IBaseRepository<FoodRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<FoodRecord | null>
  findRecordWithOwnerByRecordIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<IFoodRecordWithOwner | null>
}
