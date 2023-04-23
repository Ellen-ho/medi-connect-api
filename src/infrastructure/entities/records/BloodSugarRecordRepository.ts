import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { BloodSugarRecordEntity } from './BloodSugarRecordEntity'
import { IBloodSugarRecordRepository } from '../../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { BloodSugarRecord } from '../../../domain/record/BloodSugarRecord'
import { BloodSugarRecordMapper } from './BloodSugarRecordMapper'

export class BloodSugarRecordRepository
  extends BaseRepository<BloodSugarRecordEntity, BloodSugarRecord>
  implements IBloodSugarRecordRepository
{
  constructor(dataSource: DataSource) {
    super(BloodSugarRecordEntity, new BloodSugarRecordMapper(), dataSource)
  }

  public async findById(id: string): Promise<BloodSugarRecord | null> {
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
