import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { WeightRecord } from '../../../domain/record/WeightRecord'
import { IWeightRecordRepository } from '../../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { WeightRecordEntity } from './WeightRecordEntity'
import { WeightRecordMapper } from './WeightRecordMapper'
import { RepositoryError } from '../../error/RepositoryError'

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
}
