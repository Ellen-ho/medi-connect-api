import { DataSource, In } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { HealthGoalEntity } from './HealthGoalEntity'
import { HealthGoalMapper } from './HealthGoalMapper'
import { IHealthGoalRepository } from '../../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { HealthGoal, HealthGoalStatus } from '../../../domain/goal/HealthGoal'
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

  public async countsByPatientId(patientId: string): Promise<number> {
    try {
      const rawCounts = await this.getQuery<Array<{ count: number }>>(
        `
        SELECT COUNT(*)
        FROM health_goals
        WHERE patient_id = $1
          AND status IN ('PENDING', 'IN_PROGRESS');
        `,
        [patientId]
      )

      return rawCounts[0].count
    } catch (e) {
      throw new RepositoryError(
        'HealthGoalEntity countsByPatientId error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndStatus(
    patientId: string,
    status: HealthGoalStatus[]
  ): Promise<HealthGoal | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          patient: { id: patientId }, // need to set @RelationId
          status: In(status),
        },
        order: { createdAt: 'DESC' },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'HealthGoalEntity findByPatientIdAndStatus error',
        e as Error
      )
    }
  }
}
