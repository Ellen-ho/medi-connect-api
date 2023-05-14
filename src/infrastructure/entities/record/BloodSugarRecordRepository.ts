import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { BloodSugarRecordEntity } from './BloodSugarRecordEntity'
import { IBloodSugarRecordRepository } from '../../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { BloodSugarRecord } from '../../../domain/record/BloodSugarRecord'
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
          blood_sugar_value_mmo: number
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
            bloodSugarValueMmo: rawRecordsWithOwner[0].blood_sugar_value_mmo,
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
}
