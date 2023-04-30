import { IBaseRepository } from '../../../shared/IBaseRepository'
import { ExerciseRecord } from '../../ExerciseRecord'

export interface IExerciseRecordRepository
  extends IBaseRepository<ExerciseRecord> {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<ExerciseRecord | null>
}
