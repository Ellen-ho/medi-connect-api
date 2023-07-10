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
  findByPatientIdAndCountAll: (
    patientId: string,
    limit: number,
    offset: number
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
      exerciseType: ExerciseType
    }>
  }>
}
