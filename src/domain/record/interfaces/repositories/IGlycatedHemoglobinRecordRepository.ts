import { IGlycatedHemoglobinRecordWithOwner } from '../../../../application/record/GetSingleGlycatedHemoglobinRecordUseCase'
import { GenderType } from '../../../patient/Patient'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { GlycatedHemoglobinRecord } from '../../GlycatedHemoglobinRecord'

export interface IGlycatedHemoglobinRecordRepository
  extends IBaseRepository<GlycatedHemoglobinRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<GlycatedHemoglobinRecord | null>
  findRecordWithOwnerByRecordIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<IGlycatedHemoglobinRecordWithOwner | null>
  findByPatientId: (
    patientId: string,
    hospitalCheckDaysAgo: number
  ) => Promise<
    Array<{
      glycated_hemoglobin_date: Date
      glycated_hemoglobin_value_percent: number
    }>
  >
  findByPatientIdAndDate: (
    patientId: string,
    date: Date
  ) => Promise<{
    glycatedHemoglobinValuePercent: number
  } | null>
  findById: (id: string) => Promise<GlycatedHemoglobinRecord | null>
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
      glycatedHemoglobinValuePercent: number
    }>
  }>
  findByPatientIdAndDateRange: (
    patientId: string,
    startDate: Date,
    currentDate: Date
  ) => Promise<
    Array<{
      glycatedHemoglobinDate: Date
      glycatedHemoglobinValuePercent: number
    }>
  >
}
