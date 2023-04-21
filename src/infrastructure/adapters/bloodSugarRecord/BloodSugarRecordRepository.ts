import { DataSource, Repository } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { BloodSugarRecordEntity } from './BloodSugarRecordEntity'
import { IBloodSugarRecordRepository } from '../../../domain/bloodSugarRecord/interfaces/repositories/IBloodSugarRecordRepository'
import { BloodSugarRecord } from '../../../domain/bloodSugarRecord/BloodSugarRecord'
import { BloodSugarRecordMapper } from './BloodSugarRecordMapper'

export class BloodSugarRecordRepository
  extends BaseRepository<BloodSugarRecordEntity>
  implements IBloodSugarRecordRepository
{
  private readonly repo: Repository<BloodSugarRecordEntity>
  constructor(dataSource: DataSource) {
    super(BloodSugarRecordEntity, dataSource)
    this.repo = this.getRepo()
  }

  public async findById(id: string): Promise<BloodSugarRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null
        ? BloodSugarRecordMapper.toDomainModel(entity)
        : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async save(bloodSugarRecord: BloodSugarRecord): Promise<void> {
    try {
      await this.getRepo().save(bloodSugarRecord)
    } catch (e) {
      throw new Error('repository findByEmail error')
    }
  }
}
