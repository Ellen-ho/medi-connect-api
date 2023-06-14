import { ISleepRecordWithOwner } from '../../../../application/record/GetSingleSleepRecordUseCase'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { SleepQualityType, SleepRecord } from '../../SleepRecord'

export interface ISleepRecordRepository extends IBaseRepository<SleepRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<SleepRecord | null>
  findRecordWithOwnerByRecordIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<ISleepRecordWithOwner | null>
  findAndCountAll: (
    limit: number,
    offset: number
  ) => Promise<{
    total_counts: number
    records: Array<{
      sleepDate: Date
      sleepQuality: SleepQualityType
    }>
  }>
  findByPatientIdAndDate: (
    patientId: string,
    sleepDate: Date
  ) => Promise<SleepRecord | null>
  findById: (id: string) => Promise<SleepRecord | null>
}
