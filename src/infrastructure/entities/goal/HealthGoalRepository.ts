import { DataSource, In, LessThanOrEqual } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { HealthGoalEntity } from './HealthGoalEntity'
import { HealthGoalMapper } from './HealthGoalMapper'
import { IHealthGoalRepository } from '../../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import {
  HealthGoal,
  HealthGoalStatus,
  IHealthGoalResult,
} from '../../../domain/goal/HealthGoal'
import { RepositoryError } from '../../error/RepositoryError'
import { GenderType } from '../../../domain/patient/Patient'

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
      throw new RepositoryError(
        'HealthGoalRepository findById error',
        e as Error
      )
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
        'HealthGoalRepository countsByPatientId error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndStatus(
    patientId: string,
    status: HealthGoalStatus[]
  ): Promise<HealthGoal[]> {
    try {
      const entities = await this.getRepo().find({
        where: {
          patient: { id: patientId }, // need to set @RelationId
          status: In(status),
        },
        order: { createdAt: 'DESC' },
      })
      return entities.length !== 0
        ? entities.map((entity) => this.getMapper().toDomainModel(entity))
        : []
    } catch (e) {
      throw new RepositoryError(
        'HealthGoalRepository findByPatientIdAndStatus error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndCountAll(
    targetPatientId: string,
    limit: number,
    offset: number
  ): Promise<{
    total_counts: number
    patientData: {
      firstName: string
      lastName: string
      birthDate: Date
      gender: GenderType
    }
    goalsData: Array<{
      startAt: Date
      endAt: Date
      status: HealthGoalStatus
      result: IHealthGoalResult | null
    }>
  }> {
    try {
      const result = await this.getRepo()
        .createQueryBuilder('goal')
        .select([
          'goal.start_at AS "startAt"',
          'goal.end_at AS "endAt"',
          'goal.status AS "status"',
          'goal.result AS "result"',
          'patient.first_name AS "firstName"',
          'patient.last_name AS "lastName"',
          'patient.birth_date AS "birthDate"',
          'patient.gender AS "gender"',
        ])
        .leftJoin('goal.patient', 'patient')
        .where('patient.id = :targetPatientId', { targetPatientId })
        .orderBy('goal.start_at', 'DESC')
        .take(limit)
        .skip(offset)
        .getRawMany()

      // Map the raw result to the desired structure
      const formattedResult = {
        total_counts: result.length,
        patientData: {
          firstName: result.length > 0 ? result[0].firstName : '',
          lastName: result.length > 0 ? result[0].lastName : '',
          birthDate: result.length > 0 ? result[0].birthDate : '',
          gender: result.length > 0 ? result[0].gender : '',
        },
        goalsData: result.map((goal) => ({
          startAt: goal.startAt,
          endAt: goal.endAt,
          status: goal.status,
          result: goal.result,
        })),
      }
      return formattedResult
    } catch (e) {
      throw new RepositoryError(
        'HealthGoalRepository findByPatientIdAndCountAll error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndStatusAndDateEdge(
    patientId: string,
    status: HealthGoalStatus[],
    edgeDate: Date
  ): Promise<HealthGoal[]> {
    try {
      const entities = await this.getRepo().find({
        where: {
          patient: { id: patientId },
          status: In(status), // need to set @RelationId
          createdAt: LessThanOrEqual(edgeDate),
        },
      })
      return entities.length !== 0
        ? entities.map((entity) => this.getMapper().toDomainModel(entity))
        : []
    } catch (e) {
      throw new RepositoryError(
        'HealthGoalRepository findByPatientIdAndStatusAndDate error',
        e as Error
      )
    }
  }

  public async deleteById(id: string): Promise<void> {
    try {
      await this.getRepo()
        .createQueryBuilder('heal_goals')
        .softDelete()
        .where('id = :id', { id })
        .execute()
    } catch (e) {
      throw new RepositoryError(
        'HealthGoalRepositoryRepository deleteById error',
        e as Error
      )
    }
  }
}
