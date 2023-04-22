import { ExerciseRecord } from '../../ExerciseRecord'

export interface IExerciseRecordRepository {
  findById: (id: string) => Promise<ExerciseRecord | null>
  save: (user: ExerciseRecord) => Promise<void>
}
