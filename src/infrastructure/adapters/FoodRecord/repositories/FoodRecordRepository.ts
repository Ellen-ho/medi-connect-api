import { DataSource, Repository } from 'typeorm'
import { IFoodRecordRepository } from '../../../../domain/foodRecord/interfaces/repositories/IFoodRecordRepository'
import { FoodRecord } from '../../../../domain/foodRecord/models/FoodRecord'
import { BaseRepository } from '../../BaseRepository'
import { FoodRecordEntity } from '../entities/FoodRecord'

export class FoodRecordRepository
  extends BaseRepository<FoodRecordEntity>
  implements IFoodRecordRepository
{
  private readonly repo: Repository<FoodRecordEntity>
  constructor(dataSource: DataSource) {
    super(FoodRecordEntity, dataSource)
    this.repo = this.getRepo()
  }
}