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
}
