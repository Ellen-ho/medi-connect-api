import { IFoodRecordWithOwner } from '../../../../application/record/GetSingleFoodRecordUseCase'
import { GenderType } from '../../../patient/Patient'
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
  findById: (id: string) => Promise<FoodRecord | null>
  findByPatientIdAndCountAll: (
    patientId: string,
    limit?: number,
    offset?: number,
    startDate?: string,
    endDate?: string
  ) => Promise<{
    total_counts: number
    patientData: {
      firstName: string
      lastName: string
      birthDate: Date
      gender: GenderType
    }
    recordsData: Array<{
      id: string
      date: Date
      foodCategory: FoodCategoryType
    }>
  }>
}
