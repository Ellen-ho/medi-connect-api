import { DataSource, Repository } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { GlycatedHemoglobinRecordEntity } from './GlycatedHemoglobinRecordEntity'
import { IGlycatedHemoglobinRecordRepository } from '../../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { GlycatedHemoglobinRecord } from '../../../domain/record/GlycatedHemoglobinRecord'
import { GlycatedHemoglobinRecordMapper } from './GlycatedHemoglobinRecordMapper'

export class GlycatedHemoglobinRecordRepository
  extends BaseRepository<GlycatedHemoglobinRecordEntity>
  implements IGlycatedHemoglobinRecordRepository
{
  private readonly repo: Repository<GlycatedHemoglobinRecordEntity>
  constructor(dataSource: DataSource) {
    super(GlycatedHemoglobinRecordEntity, dataSource)
    this.repo = this.getRepo()
  }

  public async findById(id: string): Promise<GlycatedHemoglobinRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null
        ? GlycatedHemoglobinRecordMapper.toDomainModel(entity)
        : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async save(
    glycatedHemoglobinRecord: GlycatedHemoglobinRecord
  ): Promise<void> {
    try {
      await this.getRepo().save(glycatedHemoglobinRecord)
    } catch (e) {
      throw new Error('repository findByEmail error')
    }
  }
}
