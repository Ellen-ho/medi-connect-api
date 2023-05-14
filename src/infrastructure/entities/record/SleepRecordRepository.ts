import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { SleepRecordEntity } from './SleepRecordEntity'
import { SleepRecordMapper } from './SleepRecordMapper'
import {
  SleepQualityType,
  SleepRecord,
} from '../../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../../domain/record/interfaces/repositories/ISleepRecordRepository'
import { RepositoryError } from '../../error/RepositoryError'
import { ISleepRecordWithOwner } from '../../../application/record/GetSingleSleepRecordUseCase'
import { GenderType } from '../../../domain/patient/Patient'

export class SleepRecordRepository
  extends BaseRepository<SleepRecordEntity, SleepRecord>
  implements ISleepRecordRepository
{
  constructor(dataSource: DataSource) {
    super(SleepRecordEntity, new SleepRecordMapper(), dataSource)
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<SleepRecord | null> {
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
        'SleepRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }

  public async findRecordWithOwnerByRecordIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<ISleepRecordWithOwner | null> {
    try {
      const rawRecordsWithOwner = await this.getQuery<
        Array<{
          id: string
          sleep_date: Date
          sleep_time: Date
          wake_up_time: Date
          sleep_quality: SleepQualityType
          sleep_duration_hour: number
          sleep_note: string | null
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
          sleep_records.*,
          patients.first_name as "patient_first_name",
          patients.last_name as "patient_last_name",
          patients.birth_date as "patient_birth_date",
          patients.gender as "patient_gender"
        FROM
          sleep_records
        LEFT JOIN
          patients ON patients.id = sleep_records.patient_id
        WHERE
          sleep_records.patient_id = $1
          AND sleep_records.id = $2
        `,
        [patientId, recordId]
      )

      return rawRecordsWithOwner.length === 0
        ? null
        : {
            id: rawRecordsWithOwner[0].id,
            sleepDate: rawRecordsWithOwner[0].sleep_date,
            sleepTime: rawRecordsWithOwner[0].sleep_time,
            wakeUpTime: rawRecordsWithOwner[0].wake_up_time,
            sleepQuality: rawRecordsWithOwner[0].sleep_quality,
            sleepDurationHour: rawRecordsWithOwner[0].sleep_duration_hour,
            sleepNote: rawRecordsWithOwner[0].sleep_note,
            createdAt: rawRecordsWithOwner[0].created_at,
            updatedAt: rawRecordsWithOwner[0].updated_at,
            patientFirstName: rawRecordsWithOwner[0].patient_first_name,
            patientLastName: rawRecordsWithOwner[0].patient_last_name,
            patientBirthDate: rawRecordsWithOwner[0].patient_birth_date,
            patientGender: rawRecordsWithOwner[0].patient_gender,
          }
    } catch (e) {
      throw new RepositoryError(
        'SleepRecordRepository findRecordWithOwnerByRecordIdAndPatientId error',
        e as Error
      )
    }
  }
}
