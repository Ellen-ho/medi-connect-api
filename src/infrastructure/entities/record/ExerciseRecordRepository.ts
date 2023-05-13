import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'

import { IExerciseRecordRepository } from '../../../domain/record/interfaces/repositories/IExerciseRepository'
import {
  ExerciseRecord,
  ExerciseType,
  IntensityType,
} from '../../../domain/record/ExerciseRecord'
import { ExerciseRecordEntity } from './ExerciseRecordEntity'
import { ExerciseRecordMapper } from './ExerciseRecordMapper'
import { RepositoryError } from '../../error/RepositoryError'
import { GenderType } from '../../../domain/patient/Patient'
import { IRecordWithOwner } from '../../../application/record/GetSingleExerciseRecordUseCase'

export class ExerciseRecordRepository
  extends BaseRepository<ExerciseRecordEntity, ExerciseRecord>
  implements IExerciseRecordRepository
{
  constructor(dataSource: DataSource) {
    super(ExerciseRecordEntity, new ExerciseRecordMapper(), dataSource)
  }

  public async findById(id: string): Promise<ExerciseRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'ExerciseRecordRepository findById error',
        e as Error
      )
    }
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<ExerciseRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: recordId,
          patient: { id: patientId }, // need to set @RelationId
        },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'ExerciseRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }

  public async findRecordWithOwnerByRecordIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<IRecordWithOwner | null> {
    try {
      const rawRecordsWithOwner = await this.getQuery<
        Array<{
          id: string
          exercise_date: Date
          exercise_type: ExerciseType
          exercise_duration_minute: number
          exercise_intensity: IntensityType
          kcalories_burned: number
          exercise_note: string | null
          created_at: Date
          updated_at: Date
          patient_first_name: string
          patient_last_name: string
          patient_birth_date: Date
          patient_gender: GenderType
        }>
      >(
        `
        SELECT
          exercise_records.*,
          patients.first_name as "patient_first_name",
          patients.last_name as "patient_last_name",
          patients.birth_date as "patient_birth_date",
          patients.gender as "patient_gender"
        FROM
          exercise_records
        LEFT JOIN
          patients ON patients.id = exercise_records.patient_id
        WHERE
          exercise_records.patient_id = $1
          AND exercise_records.id = $2
        `,
        [patientId, recordId]
      )

      return rawRecordsWithOwner.length === 0
        ? null
        : {
            id: rawRecordsWithOwner[0].id,
            exerciseDate: rawRecordsWithOwner[0].exercise_date,
            exerciseType: rawRecordsWithOwner[0].exercise_type,
            exerciseDurationMinute:
              rawRecordsWithOwner[0].exercise_duration_minute,
            exerciseIntensity: rawRecordsWithOwner[0].exercise_intensity,
            kcaloriesBurned: rawRecordsWithOwner[0].kcalories_burned,
            exerciseNote: rawRecordsWithOwner[0].exercise_note,
            createdAt: rawRecordsWithOwner[0].created_at,
            updatedAt: rawRecordsWithOwner[0].updated_at,
            patientFirstName: rawRecordsWithOwner[0].patient_first_name,
            patientLastName: rawRecordsWithOwner[0].patient_last_name,
            patientBirthDate: rawRecordsWithOwner[0].patient_birth_date,
            patientGender: rawRecordsWithOwner[0].patient_gender,
          }
    } catch (e) {
      throw new RepositoryError(
        'ExerciseRecordRepository findRecordWithOwnerByRecordIdAndPatientId error',
        e as Error
      )
    }
  }
}
