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
    offset: number,
    startDate: string,
    endDate: string
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
      bloodSugarValue: number
      bloodSugarType: BloodSugarType
    }>
  }>
  findByGoalDurationDays: (
    startDate: Date,
    endDate: Date
  ) => Promise<
    | Array<{
        id: string
        bloodSugarValue: number
        bloodSugarDate: string
      }>
    | []
  >
}
