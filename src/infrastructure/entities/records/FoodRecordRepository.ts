import { DataSource } from 'typeorm'

import { BaseRepository } from '../../database/BaseRepository'
import { FoodRecordEntity } from './FoodRecordEntity'
import { IFoodRecordRepository } from '../../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { FoodRecord } from '../../../domain/record/FoodRecord'
import { FoodRecordMapper } from './FoodRecordMapper'
import { RepositoryError } from '../../error/RepositoryError'

export class FoodRecordRepository
  extends BaseRepository<FoodRecordEntity, FoodRecord>
  implements IFoodRecordRepository
{
  constructor(dataSource: DataSource) {
    super(FoodRecordEntity, new FoodRecordMapper(), dataSource)
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<FoodRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: recordId,
          patient: { id: patientId }, // need to set @RelationId
        },
      })

      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'FoodRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }
}
