import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { WeightRecord } from '../../../domain/record/WeightRecord'
import { IWeightRecordRepository } from '../../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { WeightRecordEntity } from './WeightRecordEntity'
import { WeightRecordMapper } from './WeightRecordMapper'
import { RepositoryError } from '../../error/RepositoryError'
import { IWeightRecordWithOwner } from '../../../application/record/GetSingleWeightRecordUseCase'
import { GenderType } from '../../../domain/patient/Patient'

export class WeightRecordRepository
  extends BaseRepository<WeightRecordEntity, WeightRecord>
  implements IWeightRecordRepository
{
  constructor(dataSource: DataSource) {
    super(WeightRecordEntity, new WeightRecordMapper(), dataSource)
  }

  public async findById(id: string): Promise<WeightRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'WeightRecordRepository findById error',
        e as Error
      )
    }
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<WeightRecord | null> {
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
        'WeightRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }

  public async findRecordWithOwnerByRecordIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<IWeightRecordWithOwner | null> {
    try {
      const rawRecordsWithOwner = await this.getQuery<
        Array<{
          id: string
          weight_date: Date
          weight_value_kg: number
          body_mass_index: number
          weight_note: string | null
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
          weight_records.*,
          patients.first_name as "patient_first_name",
          patients.last_name as "patient_last_name",
          patients.birth_date as "patient_birth_date",
          patients.gender as "patient_gender"
        FROM
          weight_records
        LEFT JOIN
          patients ON patients.id = weight_records.patient_id
        WHERE
          weight_records.patient_id = $1
          AND weight_records.id = $2
        `,
        [patientId, recordId]
      )

      return rawRecordsWithOwner.length === 0
        ? null
        : {
            id: rawRecordsWithOwner[0].id,
            weightDate: rawRecordsWithOwner[0].weight_date,
            weightValueKg: rawRecordsWithOwner[0].weight_value_kg,
            bodyMassIndex: rawRecordsWithOwner[0].body_mass_index,
            weightNote: rawRecordsWithOwner[0].weight_note,
            createdAt: rawRecordsWithOwner[0].created_at,
            updatedAt: rawRecordsWithOwner[0].updated_at,
            patientFirstName: rawRecordsWithOwner[0].patient_first_name,
            patientLastName: rawRecordsWithOwner[0].patient_last_name,
            patientBirthDate: rawRecordsWithOwner[0].patient_birth_date,
            patientGender: rawRecordsWithOwner[0].patient_gender,
          }
    } catch (e) {
      throw new RepositoryError(
        'WeightRecordRepository findRecordWithOwnerByRecordIdAndPatientId error',
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
      weightDate: Date
      weightValueKg: number
    }>
  }> {
    try {
      const rawRecords = await this.getQuery<
        Array<{
          total_counts: number
          weight_date: Date
          weight_value_kg: number
        }>
      >(
        `
          SELECT
            (SELECT COUNT(*) FROM weight_records) as total_counts,
            weight_date,
            weight_value_kg
          FROM
            weight_records
          ORDER BY weight_date DESC
          LIMIT $1
          OFFSET $2
        `,
        [limit, offset]
      )

      return {
        total_counts: rawRecords[0].total_counts,
        records: rawRecords.map((record) => ({
          weightDate: record.weight_date,
          weightValueKg: record.weight_value_kg,
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'WeightRecordRepository findAndCountAll error',
        e as Error
      )
    }
  }

  public async weightCountByPatientId(
    patientId: string,
    daysAgo: number
  ): Promise<
    Array<{
      weight_date: Date
      weight_value_kg: number
      body_mass_index: number
    }>
  > {
    try {
      const weightRawCounts = await this.getQuery<
        Array<{
          weight_date: Date
          weight_value_kg: number
          body_mass_index: number
        }>
      >(
        `SELECT
              weight_date,
              weight_value_kg,
              body_mass_index
          FROM
              weight_records
          WHERE
              patient_id = $1
              AND weight_records."weight_date" >= CURRENT_DATE - INTERVAL '1 day' * $2
              AND weight_records."weight_date" < CURRENT_DATE
          ORDER BY
              weight_records."weight_date" DESC
   `,
        [patientId, daysAgo]
      )

      return weightRawCounts
    } catch (e) {
      throw new RepositoryError(
        'WightRecordRepository weightCountByPatientId error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndDate(
    patientId: string,
    date: Date
  ): Promise<{
    weightValueKg: number
    bodyMassIndex: number
  } | null> {
    try {
      const weightAndBodyMassIndexRawValue = await this.getQuery<
        Array<{
          weight_value_kg: number
          body_mass_index: number
        }>
      >(
        `SELECT
             weight_value_kg,
              body_mass_index
          FROM
              weight_records
          WHERE
              weight_records.patient_id = $1
              AND DATE(weight_records.weight_date) = DATE($2)
          ORDER BY
            weight_records.weight_date DESC
          LIMIT 1
   `,
        [patientId, date]
      )
      return weightAndBodyMassIndexRawValue.length === 0
        ? null
        : {
            weightValueKg: weightAndBodyMassIndexRawValue[0].weight_value_kg,
            bodyMassIndex: weightAndBodyMassIndexRawValue[0].body_mass_index,
          }
    } catch (e) {
      throw new RepositoryError(
        'WightRecordRepository findByPatientIdAndDate error',
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
      weightDate: Date
      weightValueKg: number
      bodyMassIndex: number
    }>
  }> {
    try {
      const rawResult = this.getRepo()
        .createQueryBuilder('record')
        .select([
          'record.weight_date AS "weightDate"',
          'record.weight_value_kg AS "weightValueKg"',
          'record.body_mass_index AS "bodyMassIndex"',
          'patient.first_name AS "firstName"',
          'patient.last_name AS "lastName"',
          'patient.birth_date AS "birthDate"',
          'patient.gender AS "gender"',
        ])
        .leftJoin('record.patient', 'patient')
        .where('patient.id = :targetPatientId', { targetPatientId })
        .orderBy('weight_date', 'DESC')
        .take(limit)
        .skip(offset)

      const result = await rawResult.getRawMany()

      // Map the raw result to the desired structure
      const formattedResult = {
        total_counts: result.length,
        patientData: {
          firstName: result.length > 0 ? result[0].firstName : '',
          lastName: result.length > 0 ? result[0].lastName : '',
          birthDate: result.length > 0 ? result[0].birthDate : '',
          gender: result.length > 0 ? result[0].gender : '',
        },
        recordsData: result.map((record) => ({
          weightDate: record.weightDate,
          weightValueKg: record.weightValueKg,
          bodyMassIndex: record.bodyMassIndex,
        })),
      }
      return formattedResult
    } catch (e) {
      throw new RepositoryError(
        'WeightRecordRepository findByPatientIdAndCountAll error',
        e as Error
      )
    }
  }
}
