import { DataSource, Repository } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { SleepRecordEntity } from './SleepRecordEntity'
import { SleepRecordMapper } from './SleepRecordMapper'
import { SleepRecord } from '../../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../../domain/record/interfaces/repositories/ISleepRecordRepository'

export class SleepRecordRepository
  extends BaseRepository<SleepRecordEntity, SleepRecord>
  implements ISleepRecordRepository
{
  private readonly repo: Repository<SleepRecordEntity>
  constructor(dataSource: DataSource) {
    super(SleepRecordEntity, new SleepRecordMapper(), dataSource)
    this.repo = this.getRepo()
  }

  public async findById(id: string): Promise<SleepRecord | null> {
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
