import { IExerciseRecordWithOwner } from '../../../../application/record/GetSingleExerciseRecordUseCase'
import { GenderType } from '../../../patient/Patient'
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
  findByPatientIdAndCountAll: (
    patientId: string,
    limit: number,
    offset: number,
    startDate: string,
    endDate: string
  ) => Promise<{
    total_counts: number
    patientData: {
      firstName: string
      lastName: string
      birthDate: Date
      gender: GenderType
    }
    recordsData: Array<{
      id: string
      date: Date
      exerciseType: ExerciseType
    }>
  }>
}
