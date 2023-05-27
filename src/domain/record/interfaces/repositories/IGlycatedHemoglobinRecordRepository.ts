import { IGlycatedHemoglobinRecordWithOwner } from '../../../../application/record/GetSingleGlycatedHemoglobinRecordUseCase'
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
  findAndCountAll: (
    limit: number,
    offset: number
  ) => Promise<{
    total_counts: number
    records: Array<{
      glycatedHemoglobinDate: Date
      glycatedHemoglobinValuePercent: number
    }>
  }>
  findByPatientId: (
    patientId: string,
    hospitalCheckDaysAgo: number
  ) => Promise<
    Array<{
      glycated_hemoglobin_date: Date
      glycated_hemoglobin_value_percent: number
    }>
  >
}
