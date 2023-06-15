import { IBloodPressureRecordWithOwner } from '../../../../application/record/GetSingleBloodPressureRecordUsecase'
import { GenderType } from '../../../patient/Patient'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { BloodPressureRecord } from '../../BloodPressureRecord'

export interface IBloodPressureRecordRepository
  extends IBaseRepository<BloodPressureRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<BloodPressureRecord | null>
  findRecordWithOwnerByRecordIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<IBloodPressureRecordWithOwner | null>
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
      bloodPressureDate: Date
      systolicBloodPressure: number
      diastolicBloodPressure: number
    }>
  }>
  bloodPressureCountByPatientId: (
    patientId: string,
    daysAgo: number
  ) => Promise<
    Array<{
      blood_pressure_date: Date
      systolic_blood_pressure: number
      diastolic_blood_pressure: number
    }>
  >
  findByPatientIdAndDate: (
    patientId: string,
    date: Date
  ) => Promise<{
    systolicBloodPressure: number
    diastolicBloodPressure: number
  } | null>
  findById: (id: string) => Promise<BloodPressureRecord | null>
}
