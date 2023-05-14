import { IExerciseRecordWithOwner } from '../../../../application/record/GetSingleExerciseRecordUseCase'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { ExerciseRecord, ExerciseType } from '../../ExerciseRecord'

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
  findAndCountAll: (
    limit: number,
    offset: number
  ) => Promise<{
    total_counts: number
    records: Array<{
      exerciseDate: Date
      exerciseType: ExerciseType
    }>
  }>
}
