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
}
