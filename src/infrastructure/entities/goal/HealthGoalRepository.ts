import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { HealthGoalEntity } from './HealthGoalEntity'
import { HealthGoalMapper } from './HealthGoalMapper'
import { IHealthGoalRepository } from '../../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { HealthGoal } from '../../../domain/goal/HealthGoal'
import { RepositoryError } from '../../error/RepositoryError'

export class HealthGoalRepository
  extends BaseRepository<HealthGoalEntity, HealthGoal>
  implements IHealthGoalRepository
{
  constructor(dataSource: DataSource) {
    super(HealthGoalEntity, new HealthGoalMapper(), dataSource)
  }

  public async findById(id: string): Promise<HealthGoal | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError('HealthGoalEntity findById error', e as Error)
    }
  }
}
