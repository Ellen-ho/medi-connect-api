import { IBloodSugarRecordWithOwner } from '../../../../application/record/GetSingleBloodSugarRecordUseCase'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { BloodSugarRecord } from '../../BloodSugarRecord'

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
}
