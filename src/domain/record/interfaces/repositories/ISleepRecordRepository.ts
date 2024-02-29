import { ISleepRecordWithOwner } from '../../../../application/record/GetSingleSleepRecordUseCase'
import { GenderType } from '../../../patient/Patient'
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
  findByPatientIdAndDate: (
    patientId: string,
    sleepDate: Date
  ) => Promise<SleepRecord | null>
  findById: (id: string) => Promise<SleepRecord | null>
  findByPatientIdAndCountAll: (
    patientId: string,
    limit: number,
    offset: number,
    startDate,
    endDate
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
      sleepQuality: SleepQualityType
    }>
  }>
}
