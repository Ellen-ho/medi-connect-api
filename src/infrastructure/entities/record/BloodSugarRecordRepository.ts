import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { BloodSugarRecordEntity } from './BloodSugarRecordEntity'
import { IBloodSugarRecordRepository } from '../../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import {
  BloodSugarRecord,
  BloodSugarType,
} from '../../../domain/record/BloodSugarRecord'
import { BloodSugarRecordMapper } from './BloodSugarRecordMapper'
import { RepositoryError } from '../../error/RepositoryError'
import { IBloodSugarRecordWithOwner } from '../../../application/record/GetSingleBloodSugarRecordUseCase'
import { GenderType } from '../../../domain/patient/Patient'

export class BloodSugarRecordRepository
  extends BaseRepository<BloodSugarRecordEntity, BloodSugarRecord>
  implements IBloodSugarRecordRepository
{
  constructor(dataSource: DataSource) {
    super(BloodSugarRecordEntity, new BloodSugarRecordMapper(), dataSource)
  }

  public async findById(id: string): Promise<BloodSugarRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'BloodSugarRecordRepository findById error',
        e as Error
      )
    }
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<BloodSugarRecord | null> {
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
        'BloodSugarRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }

  public async findRecordWithOwnerByRecordIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<IBloodSugarRecordWithOwner | null> {
    try {
      const rawRecordsWithOwner = await this.getQuery<
        Array<{
          id: string
          blood_sugar_date: Date
          blood_sugar_value: number
          blood_sugar_type: BloodSugarType
          blood_sugar_note: string | null
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
          blood_sugar_records.*,
          patients.first_name as "patient_first_name",
          patients.last_name as "patient_last_name",
          patients.birth_date as "patient_birth_date",
          patients.gender as "patient_gender"
        FROM
          blood_sugar_records
        LEFT JOIN
          patients ON patients.id = blood_sugar_records.patient_id
        WHERE
          blood_sugar_records.patient_id = $1
          AND blood_sugar_records.id = $2
        `,
        [patientId, recordId]
      )

      return rawRecordsWithOwner.length === 0
        ? null
        : {
            id: rawRecordsWithOwner[0].id,
            bloodSugarDate: rawRecordsWithOwner[0].blood_sugar_date,
            bloodSugarValue: rawRecordsWithOwner[0].blood_sugar_value,
            bloodSugarType: rawRecordsWithOwner[0].blood_sugar_type,
            bloodSugarNote: rawRecordsWithOwner[0].blood_sugar_note,
            createdAt: rawRecordsWithOwner[0].created_at,
            updatedAt: rawRecordsWithOwner[0].updated_at,
            patientFirstName: rawRecordsWithOwner[0].patient_first_name,
            patientLastName: rawRecordsWithOwner[0].patient_last_name,
            patientBirthDate: rawRecordsWithOwner[0].patient_birth_date,
            patientGender: rawRecordsWithOwner[0].patient_gender,
          }
    } catch (e) {
      throw new RepositoryError(
        'BloodSugarRecordRepository findRecordWithOwnerByRecordIdAndPatientId error',
        e as Error
      )
    }
  }

  public async bloodSugarCountByPatientId(
    patientId: string,
    daysAgo: number
  ): Promise<
    Array<{
      blood_sugar_date: Date
      blood_sugar_value: number
      blood_sugar_type: BloodSugarType
    }>
  > {
    try {
      const bloodSugarRawCounts = await this.getQuery<
        Array<{
          blood_sugar_date: Date
          blood_sugar_value: number
          blood_sugar_type: BloodSugarType
        }>
      >(
        `SELECT
              blood_sugar_date,
              blood_sugar_value,
              blood_sugar_type
          FROM
              blood_sugar_records
          WHERE
              patient_id = $1
              AND blood_sugar_records."blood_sugar_date">= CURRENT_DATE - INTERVAL '1 day' * $2
              AND blood_sugar_records."blood_sugar_date" < CURRENT_DATE
          ORDER BY
              blood_sugar_records."blood_sugar_date" DESC
   `,
        [patientId, daysAgo]
      )

      return bloodSugarRawCounts
    } catch (e) {
      throw new RepositoryError(
        'BloodSugarRecordRepository bloodSugarCountByPatientId error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndDate(
    patientId: string,
    date: Date
  ): Promise<{
    bloodSugarValue: number
    bloodSugarType: BloodSugarType
  } | null> {
    try {
      const bloodSugarRawValue = await this.getQuery<
        Array<{
          blood_sugar_value: number
          blood_sugar_type: BloodSugarType
        }>
      >(
        `SELECT
              blood_sugar_value,
              blood_sugar_type
          FROM
              blood_sugar_records
          WHERE
              blood_sugar_records.patient_id = $1
              AND DATE(blood_sugar_records.blood_sugar_date) = DATE($2)
          ORDER BY
            blood_sugar_records.blood_sugar_date DESC
          LIMIT 1
   `,
        [patientId, date]
      )

      return bloodSugarRawValue.length === 0
        ? null
        : {
            bloodSugarValue: bloodSugarRawValue[0].blood_sugar_value,
            bloodSugarType: bloodSugarRawValue[0].blood_sugar_type,
          }
    } catch (e) {
      throw new RepositoryError(
        'BloodSugarRecordRepository findByPatientIdAndDate error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndCountAll(
    targetPatientId: string,
    limit: number,
    offset: number
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
      bloodSugarValue: number // mg/L
      bloodSugarType: BloodSugarType
    }>
  }> {
    try {
      const totalCountsQuery = await this.getRepo()
        .createQueryBuilder('record')
        .leftJoin('record.patient', 'patient')
        .where('patient.id = :targetPatientId', { targetPatientId })
        .getCount()

      const result = await this.getRepo()
        .createQueryBuilder('record')
        .select([
          'record.id AS "id"',
          'record.blood_sugar_date AS "bloodSugarDate"',
          'record.blood_sugar_value AS "bloodSugarValue"',
          'record.blood_sugar_type AS "bloodSugarType"',
          'patient.first_name AS "firstName"',
          'patient.last_name AS "lastName"',
          'patient.birth_date AS "birthDate"',
          'patient.gender AS "gender"',
        ])
        .leftJoin('record.patient', 'patient')
        .where('patient.id = :targetPatientId', { targetPatientId })
        .orderBy('record.blood_sugar_date', 'DESC')
        .limit(limit)
        .offset(offset)
        .getRawMany()

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
          date: record.bloodSugarDate,
          bloodSugarValue: record.bloodSugarValue,
          bloodSugarType: record.bloodSugarType,
        })),
      }
      return formattedResult
    } catch (e) {
      throw new RepositoryError(
        'BloodSugarRecordRepository findByPatientIdAndCountAll error',
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
        bloodSugarValue: number
        bloodSugarType: BloodSugarType
        bloodSugarDate: Date
      }>
    | []
  > {
    try {
      const results = await this.getRepo()
        .createQueryBuilder('blood_sugar_record')
        .select('blood_sugar_record.id', 'id')
        .addSelect('blood_sugar_record.blood_sugar_value', 'bloodSugarValue')
        .addSelect('blood_sugar_record.blood_sugar_type', 'bloodSugarType')
        .addSelect('blood_sugar_record.blood_sugar_date', 'bloodSugarDate')
        .where('blood_sugar_record.blood_sugar_date >= :startDate', {
          startDate,
        })
        .andWhere('blood_sugar_record.blood_sugar_date <= :endDate', {
          endDate,
        })
        .getRawMany()

      if (results.length === 0) {
        return []
      }
      const datas = results.map((result) => {
        return {
          id: result.id,
          bloodSugarValue: result.bloodSugarValue,
          bloodSugarType: result.bloodSugarType,
          bloodSugarDate: result.bloodPressureDate,
        }
      })
      return datas
    } catch (e) {
      throw new RepositoryError(
        'BloodSugarRecordRepository findByGoalDurationDays error',
        e as Error
      )
    }
  }
}
