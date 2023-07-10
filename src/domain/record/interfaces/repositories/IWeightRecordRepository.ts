import { IWeightRecordWithOwner } from '../../../../application/record/GetSingleWeightRecordUseCase'
import { GenderType } from '../../../patient/Patient'
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
  weightCountByPatientId: (
    patientId: string,
    daysAgo: number
  ) => Promise<
    Array<{
      weight_date: Date
      weight_value_kg: number
      body_mass_index: number
    }>
  >
  findByPatientIdAndDate: (
    patientId: string,
    date: Date
  ) => Promise<{
    weightValueKg: number
    bodyMassIndex: number
    weightDate: Date
  } | null>
  findById: (id: string) => Promise<WeightRecord | null>
  findByPatientIdAndCountAll: (
    patientId: string,
    limit: number,
    offset: number
  ) => Promise<{
    total_counts: number
    patientData: {
      firstName: string
      lastName: string
      birthDate: Date
      gender: GenderType
    }
    recordsData: Array<{
      date: Date
      weightValueKg: number
      bodyMassIndex: number
    }>
  }>
}
