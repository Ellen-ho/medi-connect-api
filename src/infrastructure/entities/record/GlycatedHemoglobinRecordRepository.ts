import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { GlycatedHemoglobinRecordEntity } from './GlycatedHemoglobinRecordEntity'

import { GlycatedHemoglobinRecord } from '../../../domain/record/GlycatedHemoglobinRecord'
import { GlycatedHemoglobinRecordMapper } from './GlycatedHemoglobinRecordMapper'
import { IGlycatedHemoglobinRecordRepository } from '../../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { RepositoryError } from '../../error/RepositoryError'
import { IGlycatedHemoglobinRecordWithOwner } from '../../../application/record/GetGlycatedHemoglobinRecordUseCase'
import { GenderType } from '../../../domain/patient/Patient'

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
          AND food_records.id = $2
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
}
