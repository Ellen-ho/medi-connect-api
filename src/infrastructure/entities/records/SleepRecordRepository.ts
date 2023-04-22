import { DataSource, Repository } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { SleepRecordEntity } from './SleepRecordEntity'
import { SleepRecordMapper } from './SleepRecordMapper'
import { SleepRecord } from '../../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../../domain/record/interfaces/repositories/ISleepRecordRepository'

export class SleepRecordRepository
  extends BaseRepository<SleepRecordEntity>
  implements ISleepRecordRepository
{
  private readonly repo: Repository<SleepRecordEntity>
  constructor(dataSource: DataSource) {
    super(SleepRecordEntity, dataSource)
    this.repo = this.getRepo()
  }

  public async findById(id: string): Promise<SleepRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? SleepRecordMapper.toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async save(sleepRecord: SleepRecord): Promise<void> {
    try {
      await this.getRepo().save(sleepRecord)
    } catch (e) {
      throw new Error('repository findByEmail error')
    }
  }
}
