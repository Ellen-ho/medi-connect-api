import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { BloodSugarRecordEntity } from './BloodSugarRecordEntity'
import { IBloodSugarRecordRepository } from '../../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { BloodSugarRecord } from '../../../domain/record/BloodSugarRecord'
import { BloodSugarRecordMapper } from './BloodSugarRecordMapper'
import { RepositoryError } from '../../error/RepositoryError'

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
}
