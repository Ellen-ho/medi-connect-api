import { IExerciseRecordWithOwner } from '../../../../application/record/GetSingleExerciseRecordUseCase'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { ExerciseRecord } from '../../ExerciseRecord'

export interface IExerciseRecordRepository
  extends IBaseRepository<ExerciseRecord> {
  findById: (id: string) => Promise<ExerciseRecord | null>
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<ExerciseRecord | null>
  findRecordWithOwnerByRecordIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<IExerciseRecordWithOwner | null>
}
