import { DataSource, Repository } from 'typeorm'

import { BaseRepository } from '../BaseRepository'
import { FoodRecordEntity } from './FoodRecordEntity'
import { IFoodRecordRepository } from '../../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { FoodRecord } from '../../../domain/record/FoodRecord'
import { FoodRecordMapper } from './FoodRecordMapper'

export class FoodRecordRepository
  extends BaseRepository<FoodRecordEntity>
  implements IFoodRecordRepository
{
  private readonly repo: Repository<FoodRecordEntity>
  constructor(dataSource: DataSource) {
    super(FoodRecordEntity, dataSource)
    this.repo = this.getRepo()
  }

  public async findById(id: string): Promise<FoodRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? FoodRecordMapper.toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async save(foodRecord: FoodRecord): Promise<void> {
    try {
      await this.getRepo().save(foodRecord)
    } catch (e) {
      throw new Error('repository findByEmail error')
    }
  }
}
