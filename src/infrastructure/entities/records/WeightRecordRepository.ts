import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { WeightRecord } from '../../../domain/record/WeightRecord'
import { IWeightRecordRepository } from '../../../domain/record/interfaces/IWeightRecordRepository'
import { WeightRecordEntity } from './WeightRecordEntity'
import { WeightRecordMapper } from './WeightRecordMapper'

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
      throw new Error('repository findById error')
    }
  }
}
