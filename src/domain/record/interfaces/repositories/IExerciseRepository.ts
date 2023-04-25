import { ExerciseRecord } from '../../ExerciseRecord'

export interface IExerciseRecordRepository {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<ExerciseRecord | null>
  save: (exerciseRecord: ExerciseRecord) => Promise<void>
}
