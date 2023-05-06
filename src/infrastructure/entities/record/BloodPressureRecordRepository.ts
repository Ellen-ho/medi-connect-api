import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { BloodPressureRecordEntity } from './BloodPressureRecordEntity'
import { IBloodPressureRecordRepository } from '../../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { BloodPressureRecord } from '../../../domain/record/BloodPressureRecord'
import { BloodPressureRecordMapper } from './BloodPressureRecordMapper'
import { RepositoryError } from '../../error/RepositoryError'

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

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<BloodPressureRecord | null> {
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
        'BloodPressureRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }
}
