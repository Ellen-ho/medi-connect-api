import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { GlycatedHemoglobinRecordEntity } from './GlycatedHemoglobinRecordEntity'

import { GlycatedHemoglobinRecord } from '../../../domain/record/GlycatedHemoglobinRecord'
import { GlycatedHemoglobinRecordMapper } from './GlycatedHemoglobinRecordMapper'
import { IGlycatedHemoglobinRecordRepository } from '../../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { RepositoryError } from '../../error/RepositoryError'
import { IGlycatedHemoglobinRecordWithOwner } from '../../../application/record/GetSingleGlycatedHemoglobinRecordUseCase'
import { GenderType } from '../../../domain/patient/Patient'
import dayjs from 'dayjs'

export class GlycatedHemoglobinRecordRepository
  extends BaseRepository<
    GlycatedHemoglobinRecordEntity,
    GlycatedHemoglobinRecord
  >
  implements IGlycatedHemoglobinRecordRepository
{
  constructor(dataSource: DataSource) {
    super(
      GlycatedHemoglobinRecordEntity,
      new GlycatedHemoglobinRecordMapper(),
      dataSource
    )
  }

  public async findById(id: string): Promise<GlycatedHemoglobinRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'GlycatedHemoglobinRecordRepository findById error',
        e as Error
      )
    }
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<GlycatedHemoglobinRecord | null> {
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
        'GlycatedHemoglobinRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }

  public async findRecordWithOwnerByRecordIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<IGlycatedHemoglobinRecordWithOwner | null> {
    try {
      const rawRecordsWithOwner = await this.getQuery<
        Array<{
          id: string
          glycated_hemoglobin_date: Date
          glycated_hemoglobin_value_percent: number
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
          glycated_hemoglobin_records.*,
          patients.first_name as "patient_first_name",
          patients.last_name as "patient_last_name",
          patients.birth_date as "patient_birth_date",
          patients.gender as "patient_gender"
        FROM
          glycated_hemoglobin_records
        LEFT JOIN
          patients ON patients.id = glycated_hemoglobin_records.patient_id
        WHERE
          glycated_hemoglobin_records.patient_id = $1
          AND glycated_hemoglobin_records.id = $2
        `,
        [patientId, recordId]
      )

      return rawRecordsWithOwner.length === 0
        ? null
        : {
            id: rawRecordsWithOwner[0].id,
            glycatedHemoglobinDate:
              rawRecordsWithOwner[0].glycated_hemoglobin_date,
            glycatedHemoglobinValuePercent:
              rawRecordsWithOwner[0].glycated_hemoglobin_value_percent,
            createdAt: rawRecordsWithOwner[0].created_at,
            updatedAt: rawRecordsWithOwner[0].updated_at,
            patientFirstName: rawRecordsWithOwner[0].patient_first_name,
            patientLastName: rawRecordsWithOwner[0].patient_last_name,
            patientBirthDate: rawRecordsWithOwner[0].patient_birth_date,
            patientGender: rawRecordsWithOwner[0].patient_gender,
          }
    } catch (e) {
      throw new RepositoryError(
        'GlycatedHemoglobinRecordRepository findRecordWithOwnerByRecordIdAndPatientId error',
        e as Error
      )
    }
  }

  public async findByPatientId(
    patientId: string,
    hospitalCheckDaysAgo: number
  ): Promise<
    Array<{
      glycated_hemoglobin_date: Date
      glycated_hemoglobin_value_percent: number
    }>
  > {
    try {
      const glycatedHemoglobinRawRecords = await this.getQuery<
        Array<{
          glycated_hemoglobin_date: Date
          glycated_hemoglobin_value_percent: number
        }>
      >(
        `SELECT
              glycated_hemoglobin_date,
              glycated_hemoglobin_value_percent
          FROM
              glycated_hemoglobin_records
          WHERE
              patient_id = $1
              AND glycated_hemoglobin_records."glycated_hemoglobin_date" >= CURRENT_DATE - INTERVAL '1 day' * $2
              AND glycated_hemoglobin_records."glycated_hemoglobin_date" < CURRENT_DATE
          ORDER BY
              glycated_hemoglobin_records."glycated_hemoglobin_date" DESC
   `,
        [patientId, hospitalCheckDaysAgo]
      )

      return glycatedHemoglobinRawRecords
    } catch (e) {
      throw new RepositoryError(
        'GlycatedHemoglobinRecordRepository findByPatientId error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndDate(
    patientId: string,
    date: Date
  ): Promise<{
    glycatedHemoglobinValuePercent: number
  } | null> {
    try {
      const glycatedHemoglobinRawValue = await this.getQuery<
        Array<{
          glycated_hemoglobin_value_percent: number
        }>
      >(
        `SELECT
              glycated_hemoglobin_value_percent
          FROM
              glycated_hemoglobin_records
          WHERE
              glycated_hemoglobin_records.patient_id = $1
              AND DATE(glycated_hemoglobin_records.glycated_hemoglobin_date) = DATE($2)
          ORDER BY
            glycated_hemoglobin_records.glycated_hemoglobin_date DESC
          LIMIT 1
   `,
        [patientId, date]
      )
      return glycatedHemoglobinRawValue.length === 0
        ? null
        : {
            glycatedHemoglobinValuePercent:
              glycatedHemoglobinRawValue[0].glycated_hemoglobin_value_percent,
          }
    } catch (e) {
      throw new RepositoryError(
        'GlycatedHemoglobinRecordRepository findByPatientIdAndDate error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndCountAll(
    targetPatientId: string,
    limit: number,
    offset: number,
    startDate: string,
    endDate: string
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
      glycatedHemoglobinValuePercent: number
    }>
  }> {
    try {
      const totalCountsQuery = await this.getRepo()
        .createQueryBuilder('record')
        .leftJoin('record.patient', 'patient')
        .where('patient.id = :targetPatientId', { targetPatientId })
        .andWhere(
          'DATE(record.glycated_hemoglobin_date) BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          }
        )
        .getCount()

      const query = this.getRepo()
        .createQueryBuilder('record')
        .select([
          'record.id AS "id"',
          'record.glycated_hemoglobin_date AS "glycatedHemoglobinDate"',
          'record.glycated_hemoglobin_value_percent AS "glycatedHemoglobinValuePercent"',
          'patient.first_name AS "firstName"',
          'patient.last_name AS "lastName"',
          'patient.birth_date AS "birthDate"',
          'patient.gender AS "gender"',
        ])
        .leftJoin('record.patient', 'patient')
        .where('patient.id = :targetPatientId', { targetPatientId })
        .andWhere(
          'DATE(record.glycated_hemoglobin_date) BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          }
        )
        .orderBy('glycated_hemoglobin_date', 'DESC')

      if (limit !== undefined && offset !== undefined) {
        query.limit(limit).offset(offset)
      }

      const result = await query.getRawMany()

      // Map the raw result to the desired structure
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
          date: record.glycatedHemoglobinDate,
          glycatedHemoglobinValuePercent: record.glycatedHemoglobinValuePercent,
        })),
      }
      return formattedResult
    } catch (e) {
      throw new RepositoryError(
        'GlycatedHemoglobinRecordRepository findByPatientIdAndCountAll error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndDateRange(
    patientId: string,
    startDate: Date,
    currentDate: Date
  ): Promise<
    Array<{
      glycatedHemoglobinDate: Date
      glycatedHemoglobinValuePercent: number
    }>
  > {
    try {
      const result = await this.getRepo()
        .createQueryBuilder('record')
        .select([
          'record.glycatedHemoglobinDate',
          'record.glycatedHemoglobinValuePercent',
        ])
        .where('record.patientId = :patientId', { patientId })
        .andWhere('record.glycatedHemoglobinDate >= :startDate', { startDate })
        .andWhere('record.glycatedHemoglobinDate <= :currentDate', {
          currentDate,
        })
        .orderBy('record.glycatedHemoglobinDate', 'DESC')
        .getMany()

      return result.length > 0 ? result : []
    } catch (e) {
      throw new RepositoryError(
        'GlycatedHemoglobinRecordRepository findByPatientIdAndCountAll error',
        e as Error
      )
    }
  }

  public async findByGoalDurationDays(
    startDate: Date,
    endDate: Date
  ): Promise<
    | Array<{
        id: string
        glycatedHemoglobinValuePercent: number
        glycatedHemoglobinDate: string
      }>
    | []
  > {
    try {
      const results = await this.getRepo()
        .createQueryBuilder('glycated_hemoglobin_record')
        .select('glycated_hemoglobin_record.id', 'id')
        .addSelect(
          'glycated_hemoglobin_record.glycated_hemoglobin_value_percent',
          'glycatedHemoglobinValuePercent'
        )
        .addSelect(
          "date_trunc('day', glycated_hemoglobin_record.glycated_hemoglobin_date)",
          'glycatedHemoglobinDate'
        )
        .where(
          'glycated_hemoglobin_record.glycated_hemoglobin_date >= :startDate',
          {
            startDate,
          }
        )
        .andWhere(
          'glycated_hemoglobin_record.glycated_hemoglobin_date <= :endDate',
          {
            endDate,
          }
        )
        .orderBy('glycated_hemoglobin_record.glycated_hemoglobin_date', 'ASC')
        .getRawMany()

      if (results.length === 0) {
        return []
      }
      const datas = results.map((result) => {
        return {
          id: result.id,
          glycatedHemoglobinValuePercent: result.glycatedHemoglobinValuePercent,
          glycatedHemoglobinDate: dayjs(result.glycatedHemoglobinDate).format(
            'YYYY-MM-DD'
          ),
        }
      })
      return datas
    } catch (e) {
      throw new RepositoryError(
        'GlycatedHemoglobinRepository findByGoalDurationDays error',
        e as Error
      )
    }
  }
}
