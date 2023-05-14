import { IWeightRecordWithOwner } from '../../../../application/record/GetSingleWeightRecordUseCase'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { WeightRecord } from '../../WeightRecord'

export interface IWeightRecordRepository extends IBaseRepository<WeightRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<WeightRecord | null>
  findRecordWithOwnerByRecordIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<IWeightRecordWithOwner | null>
  findAndCountAll: (
    limit: number,
    offset: number
  ) => Promise<{
    total_counts: number
    records: Array<{
      weightDate: Date
      weightValueKg: number
    }>
  }>
}
