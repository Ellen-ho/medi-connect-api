import { DataSource } from 'typeorm'

import { BaseRepository } from '../../database/BaseRepository'
import { FoodRecordEntity } from './FoodRecordEntity'
import { IFoodRecordRepository } from '../../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { FoodCategoryType, FoodRecord } from '../../../domain/record/FoodRecord'
import { FoodRecordMapper } from './FoodRecordMapper'
import { RepositoryError } from '../../error/RepositoryError'
import { IFoodRecordWithOwner } from '../../../application/record/GetSingleFoodRecordUseCase'
import { GenderType } from '../../../domain/patient/Patient'

export class FoodRecordRepository
  extends BaseRepository<FoodRecordEntity, FoodRecord>
  implements IFoodRecordRepository
{
  constructor(dataSource: DataSource) {
    super(FoodRecordEntity, new FoodRecordMapper(), dataSource)
  }

  public async findById(id: string): Promise<FoodRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'FoodRecordRepository findById error',
        e as Error
      )
    }
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<FoodRecord | null> {
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
        'FoodRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }

  public async findRecordWithOwnerByRecordIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<IFoodRecordWithOwner | null> {
    try {
      const rawRecordsWithOwner = await this.getQuery<
        Array<{
          id: string
          food_time: Date
          food_category: FoodCategoryType
          food_amount: number
          kcalories: number
          food_note: string | null
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
          food_records
        LEFT JOIN
          patients ON patients.id = food_records.patient_id
        WHERE
          food_records.patient_id = $1
          AND food_records.id = $2
        `,
        [patientId, recordId]
      )

      return rawRecordsWithOwner.length === 0
        ? null
        : {
            id: rawRecordsWithOwner[0].id,
            foodTime: rawRecordsWithOwner[0].food_time,
            foodCategory: rawRecordsWithOwner[0].food_category,
            foodAmount: rawRecordsWithOwner[0].food_amount,
            kcalories: rawRecordsWithOwner[0].kcalories,
            foodNote: rawRecordsWithOwner[0].food_note,
            createdAt: rawRecordsWithOwner[0].created_at,
            updatedAt: rawRecordsWithOwner[0].updated_at,
            patientFirstName: rawRecordsWithOwner[0].patient_first_name,
            patientLastName: rawRecordsWithOwner[0].patient_last_name,
            patientBirthDate: rawRecordsWithOwner[0].patient_birth_date,
            patientGender: rawRecordsWithOwner[0].patient_gender,
          }
    } catch (e) {
      throw new RepositoryError(
        'FoodRecordRepository findRecordWithOwnerByRecordIdAndPatientId error',
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
      foodTime: Date
      foodCategory: FoodCategoryType
    }>
  }> {
    try {
      const rawRecords = await this.getQuery<
        Array<{
          total_counts: number
          food_time: Date
          food_category: FoodCategoryType
        }>
      >(
        `
          SELECT
            (SELECT COUNT(*) FROM food_records) as total_counts,
            food_time,
            food_category
          FROM
            food_records
          ORDER BY food_date DESC, food_records.update_at DESC
          LIMIT $1
          OFFSET $2
        `,
        [limit, offset]
      )

      return {
        total_counts: rawRecords[0].total_counts,
        records: rawRecords.map((record) => ({
          foodTime: record.food_time,
          foodCategory: record.food_category,
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'FoodRecordRepository findAndCountAll error',
        e as Error
      )
    }
  }
}
