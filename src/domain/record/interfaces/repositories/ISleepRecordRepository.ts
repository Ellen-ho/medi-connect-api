import { ISleepRecordWithOwner } from '../../../../application/record/GetSingleSleepRecordUseCase'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { SleepRecord } from '../../SleepRecord'

export interface ISleepRecordRepository extends IBaseRepository<SleepRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<SleepRecord | null>
  findRecordWithOwnerByRecordIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<ISleepRecordWithOwner | null>
}
