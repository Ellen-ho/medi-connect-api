import { IBloodSugarRecordWithOwner } from '../../../../application/record/GetSingleBloodSugarRecordUseCase'
import { GenderType } from '../../../patient/Patient'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { BloodSugarRecord, BloodSugarType } from '../../BloodSugarRecord'

export interface IBloodSugarRecordRepository
  extends IBaseRepository<BloodSugarRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<BloodSugarRecord | null>
  findRecordWithOwnerByRecordIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<IBloodSugarRecordWithOwner | null>
  findAndCountAll: (
    limit: number,
    offset: number
  ) => Promise<{
    total_counts: number
    records: Array<{
      bloodSugarDate: Date
      bloodSugarValue: number
      bloodSugarType: BloodSugarType
    }>
  }>
  bloodSugarCountByPatientId: (
    patientId: string,
    daysAgo: number
  ) => Promise<
    Array<{
      blood_sugar_date: Date
      blood_sugar_value: number
      blood_sugar_type: BloodSugarType
    }>
  >
  findByPatientIdAndDate: (
    patientId: string,
    date: Date
  ) => Promise<{
    bloodSugarValue: number
    bloodSugarType: BloodSugarType
  } | null>
  findById: (id: string) => Promise<BloodSugarRecord | null>
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
      bloodSugarDate: Date
      bloodSugarValue: number
      bloodSugarType: BloodSugarType
    }>
  }>
}
