import { DataSource, Repository } from 'typeorm'

import { BaseRepository } from '../BaseRepository'
import { BloodPressureRecordEntity } from './BloodPressureRecordEntity'
import { IBloodPressureRecordRepository } from '../../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { BloodPressureRecord } from '../../../domain/record/BloodPressureRecord'
import { BloodPressureRecordMapper } from './BloodPressureRecordMapper'

export class BloodPressureRecordRepository
  extends BaseRepository<BloodPressureRecordEntity>
  implements IBloodPressureRecordRepository
{
  private readonly repo: Repository<BloodPressureRecordEntity>
  constructor(dataSource: DataSource) {
    super(BloodPressureRecordEntity, dataSource)
    this.repo = this.getRepo()
  }

  public async findById(id: string): Promise<BloodPressureRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null
        ? BloodPressureRecordMapper.toDomainModel(entity)
        : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async save(bloodPressureRecord: BloodPressureRecord): Promise<void> {
    try {
      await this.getRepo().save(bloodPressureRecord)
    } catch (e) {
      throw new Error('repository findByEmail error')
    }
  }
}
