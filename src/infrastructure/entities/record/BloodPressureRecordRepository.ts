import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { BloodPressureRecordEntity } from './BloodPressureRecordEntity'
import { IBloodPressureRecordRepository } from '../../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { BloodPressureRecord } from '../../../domain/record/BloodPressureRecord'
import { BloodPressureRecordMapper } from './BloodPressureRecordMapper'
import { RepositoryError } from '../../error/RepositoryError'

import { GenderType } from '../../../domain/patient/Patient'
import { IBloodPressureRecordWithOwner } from '../../../application/record/GetSingleBloodPressureRecordUsecase'
import dayjs from 'dayjs'

export class BloodPressureRecordRepository
  extends BaseRepository<BloodPressureRecordEntity, BloodPressureRecord>
  implements IBloodPressureRecordRepository
{
  constructor(dataSource: DataSource) {
    super(
      BloodPressureRecordEntity,
      new BloodPressureRecordMapper(),
      dataSource
    )
  }

  public async findById(id: string): Promise<BloodPressureRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'BloodPressureRecordRepository findById error',
        e as Error
      )
    }
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<BloodPressureRecord | null> {
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
        'BloodPressureRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }

  public async findRecordWithOwnerByRecordIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<IBloodPressureRecordWithOwner | null> {
    try {
      const rawRecordsWithOwner = await this.getQuery<
        Array<{
          id: string
          blood_pressure_date: Date
          systolic_blood_pressure: number
          diastolic_blood_pressure: number
          heart_beat: number
          blood_pressure_note: string | null
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
          blood_pressure_records.*,
          patients.first_name as "patient_first_name",
          patients.last_name as "patient_last_name",
          patients.birth_date as "patient_birth_date",
          patients.gender as "patient_gender"
        FROM
          blood_pressure_records
        LEFT JOIN
          patients ON patients.id = blood_pressure_records.patient_id
        WHERE
          blood_pressure_records.patient_id = $1
          AND blood_pressure_records.id = $2
        `,
        [patientId, recordId]
      )

      return rawRecordsWithOwner.length === 0
        ? null
        : {
            id: rawRecordsWithOwner[0].id,
            bloodPressureDate: rawRecordsWithOwner[0].blood_pressure_date,
            systolicBloodPressure:
              rawRecordsWithOwner[0].systolic_blood_pressure,
            diastolicBloodPressure:
              rawRecordsWithOwner[0].diastolic_blood_pressure,
            heartBeat: rawRecordsWithOwner[0].heart_beat,
            bloodPressureNote: rawRecordsWithOwner[0].blood_pressure_note,
            createdAt: rawRecordsWithOwner[0].created_at,
            updatedAt: rawRecordsWithOwner[0].updated_at,
            patientFirstName: rawRecordsWithOwner[0].patient_first_name,
            patientLastName: rawRecordsWithOwner[0].patient_last_name,
            patientBirthDate: rawRecordsWithOwner[0].patient_birth_date,
            patientGender: rawRecordsWithOwner[0].patient_gender,
          }
    } catch (e) {
      throw new RepositoryError(
        'BloodPressureRecordRepository findRecordWithOwnerByRecordIdAndPatientId error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndCountAll(
    targetPatientId: string,
    startDate?: string,
    endDate?: string,
    offset?: number,
    limit?: number
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
      systolicBloodPressure: number
      diastolicBloodPressure: number
    }>
  }> {
    const totalCountsQuery = await this.getRepo()
      .createQueryBuilder('record')
      .leftJoin('record.patient', 'patient')
      .where('patient.id = :targetPatientId', { targetPatientId })
      .andWhere(
        'DATE(record.blood_pressure_date) BETWEEN :startDate AND :endDate',
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
        'record.blood_pressure_date AS "bloodPressureDate"',
        'record.systolic_blood_pressure AS "systolicBloodPressure"',
        'record.diastolic_blood_pressure AS "diastolicBloodPressure"',
        'patient.first_name AS "firstName"',
        'patient.last_name AS "lastName"',
        'patient.birth_date AS "birthDate"',
        'patient.gender AS "gender"',
      ])
      .leftJoin('record.patient', 'patient')
      .where('patient.id = :targetPatientId', { targetPatientId })
      .andWhere(
        'DATE(record.blood_pressure_date) BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        }
      )
      .orderBy('record.blood_pressure_date', 'DESC')

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
        date: new Date(
          dayjs(record.bloodPressureDate).add(8, 'hour').toISOString()
        ),
        systolicBloodPressure: record.systolicBloodPressure,
        diastolicBloodPressure: record.diastolicBloodPressure,
      })),
    }

    return formattedResult
  }

  public async bloodPressureCountByPatientId(
    patientId: string,
    daysAgo: number
  ): Promise<
    Array<{
      blood_pressure_date: Date
      systolic_blood_pressure: number
      diastolic_blood_pressure: number
    }>
  > {
    try {
      const bloodPressureRawCounts = await this.getQuery<
        Array<{
          blood_pressure_date: Date
          systolic_blood_pressure: number
          diastolic_blood_pressure: number
        }>
      >(
        `SELECT
          blood_pressure_date,
          systolic_blood_pressure,
          diastolic_blood_pressure
    FROM
          blood_pressure_records
    WHERE
          patient_id = $1
          AND blood_pressure_records."blood_pressure_date" >= CURRENT_DATE - INTERVAL '1 day' * $2
          AND blood_pressure_records."blood_pressure_date" < CURRENT_DATE
    ORDER BY
          blood_pressure_records."blood_pressure_date" DESC

        `,
        [patientId, daysAgo]
      )

      return bloodPressureRawCounts
    } catch (e) {
      throw new RepositoryError(
        'BloodPressureRecordRepository bloodPressureCountByPatientId error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndDate(
    patientId: string,
    date: Date
  ): Promise<{
    systolicBloodPressure: number
    diastolicBloodPressure: number
  } | null> {
    try {
      const bloodPressureRawValue = await this.getQuery<
        Array<{
          systolic_blood_pressure: number
          diastolic_blood_pressure: number
        }>
      >(
        `SELECT
             systolic_blood_pressure,
              diastolic_blood_pressure
          FROM
              blood_pressure_records
          WHERE
              blood_pressure_records.patient_id = $1
              AND DATE(blood_pressure_records.blood_pressure_date) = DATE($2)
          ORDER BY
            blood_pressure_records.blood_pressure_date DESC
          LIMIT 1
   `,
        [patientId, date]
      )

      return bloodPressureRawValue.length === 0
        ? null
        : {
            systolicBloodPressure:
              bloodPressureRawValue[0].systolic_blood_pressure,
            diastolicBloodPressure:
              bloodPressureRawValue[0].diastolic_blood_pressure,
          }
    } catch (e) {
      throw new RepositoryError(
        'BloodPressureRecordRepository findByPatientIdAndDat error',
        e as Error
      )
    }
  }

  public async findByGoalDurationDays(
    targetPatientId: string,
    startDate: Date,
    endDate: Date
  ): Promise<
    | Array<{
        id: string
        systolicBloodPressure: number
        diastolicBloodPressure: number
        bloodPressureDate: string
      }>
    | []
  > {
    try {
      const results = await this.getRepo()
        .createQueryBuilder('blood_pressure_record')
        .select('blood_pressure_record.id', 'id')
        .addSelect(
          'blood_pressure_record.systolic_blood_pressure',
          'systolicBloodPressure'
        )
        .addSelect(
          'blood_pressure_record.diastolic_blood_pressure',
          'diastolicBloodPressure'
        )
        .addSelect(
          "date_trunc('day', blood_pressure_record.blood_pressure_date)",
          'bloodPressureDate'
        )
        .where('blood_pressure_record.blood_pressure_date >= :startDate', {
          startDate,
        })
        .andWhere('blood_pressure_record.blood_pressure_date <= :endDate', {
          endDate,
        })
        .andWhere('blood_pressure_record.patient_id = :targetPatientId', {
          targetPatientId,
        })
        .orderBy('blood_pressure_record.blood_pressure_date', 'ASC')
        .getRawMany()

      if (results.length === 0) {
        return []
      }
      const datas = results.map((result) => {
        return {
          id: result.id,
          systolicBloodPressure: result.systolicBloodPressure,
          diastolicBloodPressure: result.diastolicBloodPressure,
          bloodPressureDate: dayjs(result.bloodPressureDate).format(
            'YYYY-MM-DD'
          ),
        }
      })
      return datas
    } catch (e) {
      throw new RepositoryError(
        'BloodPressureRecordRepository findByGoalDurationDays error',
        e as Error
      )
    }
  }
}
