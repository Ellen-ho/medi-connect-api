import { DataSource } from 'typeorm'

import { BaseRepository } from '../BaseRepository'
import { FoodRecordEntity } from './FoodRecordEntity'
import { IFoodRecordRepository } from '../../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { FoodRecord } from '../../../domain/record/FoodRecord'
import { FoodRecordMapper } from './FoodRecordMapper'

export class FoodRecordRepository
  extends BaseRepository<FoodRecordEntity, FoodRecord>
  implements IFoodRecordRepository
{
  constructor(dataSource: DataSource) {
    super(FoodRecordEntity, new FoodRecordMapper(), dataSource)
  }

  public async findById(id: string): Promise<FoodRecord | null> {
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
