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
import dayjs from 'dayjs'

export class SleepRecordRepository
  extends BaseRepository<SleepRecordEntity, SleepRecord>
  implements ISleepRecordRepository
{
  constructor(dataSource: DataSource) {
    super(SleepRecordEntity, new SleepRecordMapper(), dataSource)
  }

  public async findById(id: string): Promise<SleepRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'SleepRecordRepository findById error',
        e as Error
      )
    }
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<SleepRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: recordId,
          patient: { id: patientId },
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
          sleep_duration_hour: string
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
            sleepDurationHour: parseFloat(
              rawRecordsWithOwner[0].sleep_duration_hour
            ),
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

  public async findAndCountAll(
    limit: number,
    offset: number
  ): Promise<{
    total_counts: number
    records: Array<{
      sleepDate: Date
      sleepQuality: SleepQualityType
    }>
  }> {
    try {
      const rawRecords = await this.getQuery<
        Array<{
          total_counts: number
          sleep_date: Date
          sleep_quality: SleepQualityType
        }>
      >(
        `
          SELECT
            (SELECT COUNT(*) FROM sleep_records) as total_counts,
            sleep_date,
            sleep_quality
          FROM
            sleep_records
          ORDER BY sleep_date DESC
          LIMIT $1
          OFFSET $2
        `,
        [limit, offset]
      )

      return {
        total_counts: rawRecords[0].total_counts,
        records: rawRecords.map((record) => ({
          sleepDate: record.sleep_date,
          sleepQuality: record.sleep_quality,
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'SleepRecordRepository findAndCountAll error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndDate(
    patientId: string,
    sleepDate: Date
  ): Promise<SleepRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          patient: { id: patientId },
          sleepDate,
        },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'SleepRecordRepository findByPatientIdAndDate error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndCountAll(
    targetPatientId: string,
    limit?: number,
    offset?: number,
    startDate?: string,
    endDate?: string
  ): Promise<{
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
      sleepQuality: SleepQualityType
    }>
  }> {
    try {
      const totalCountsQuery = await this.getRepo()
        .createQueryBuilder('record')
        .leftJoin('record.patient', 'patient')
        .where('patient.id = :targetPatientId', { targetPatientId })
        .andWhere('DATE(record.sleep_date) BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .getCount()

      const query = this.getRepo()
        .createQueryBuilder('record')
        .select([
          'record.id AS "id"',
          'record.sleep_date AS "sleepDate"',
          'record.sleep_quality AS "sleepQuality"',
          'patient.first_name AS "firstName"',
          'patient.last_name AS "lastName"',
          'patient.birth_date AS "birthDate"',
          'patient.gender AS "gender"',
        ])
        .leftJoin('record.patient', 'patient')
        .where('patient.id = :targetPatientId', { targetPatientId })
        .andWhere('DATE(record.sleep_date) BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .orderBy('sleep_date', 'DESC')

      if (limit !== undefined && offset !== undefined) {
        query.limit(limit).offset(offset)
      }

      const result = await query.getRawMany()

      const formattedResult = {
        total_counts: totalCountsQuery,
        patientData: {
          firstName: result.length > 0 ? result[0].firstName : '',
          lastName: result.length > 0 ? result[0].lastName : '',
          birthDate: result.length > 0 ? result[0].birthDate : '',
          gender: result.length > 0 ? result[0].gender : '',
        },
        recordsData: result.map((record) => ({
          id: record.id,
          date: new Date(dayjs(record.sleepDate).add(8, 'hour').toISOString()),
          sleepQuality: record.sleepQuality,
        })),
      }
      return formattedResult
    } catch (e) {
      throw new RepositoryError(
        'SleepRecordRepository findByPatientIdAndCountAll error',
        e as Error
      )
    }
  }
}
