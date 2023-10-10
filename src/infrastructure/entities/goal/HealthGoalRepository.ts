import { DataSource, In, IsNull, LessThanOrEqual } from 'typeorm'
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
import { IExecutor } from '../../../domain/shared/IRepositoryTx'

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
        where: { id, deletedAt: IsNull() },
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
      id: string
      startAt: Date
      endAt: Date
      status: HealthGoalStatus
      result: IHealthGoalResult | null
      createdAt: Date
    }>
  }> {
    try {
      const totalCountsQuery = await this.getRepo()
        .createQueryBuilder('record')
        .leftJoin('record.patient', 'patient')
        .where('patient.id = :targetPatientId', { targetPatientId })
        .getCount()

      const result = await this.getRepo()
        .createQueryBuilder('goal')
        .select([
          'goal.id AS "id"',
          'goal.start_at AS "startAt"',
          'goal.end_at AS "endAt"',
          'goal.status AS "status"',
          'goal.result AS "result"',
          'goal.created_at AS "createdAt"',
          'patient.first_name AS "firstName"',
          'patient.last_name AS "lastName"',
          'patient.birth_date AS "birthDate"',
          'patient.gender AS "gender"',
        ])
        .leftJoin('goal.patient', 'patient')
        .where('patient.id = :targetPatientId', { targetPatientId })
        .orderBy('goal.start_at', 'DESC')
        .limit(limit)
        .offset(offset)
        .getRawMany()

      // Map the raw result to the desired structure
      const formattedResult = {
        total_counts: totalCountsQuery,
        patientData: {
          firstName: result.length > 0 ? result[0].firstName : '',
          lastName: result.length > 0 ? result[0].lastName : '',
          birthDate: result.length > 0 ? result[0].birthDate : '',
          gender: result.length > 0 ? result[0].gender : '',
        },
        goalsData: result.map((goal) => ({
          id: goal.id,
          startAt: goal.startAt,
          endAt: goal.endAt,
          status: goal.status,
          result: goal.result,
          createdAt: goal.createdAt,
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

  public async delete(
    goal: HealthGoal,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      const entity = this.getMapper().toPersistence(goal)
      await executor.softRemove(entity)
    } catch (e) {
      throw new RepositoryError(
        `HealthGoalRepositoryRepository delete error: ${(e as Error).message}`,
        e as Error
      )
    }
  }

  public async findAllByCurrentDayEndAt(): Promise<HealthGoal[]> {
    try {
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0) // set time to the beginning of current date

      const nextDate = new Date(currentDate)
      nextDate.setDate(currentDate.getDate() + 1) // set time to the beginning of next date

      const healthGoals = await this.getRepo()
        .createQueryBuilder('health_goal')
        .where('health_goal.end_at >= :currentDate', { currentDate })
        .andWhere('health_goal.end_at < :nextDate', { nextDate })
        .getMany()

      console.table({ healthGoals: JSON.stringify(healthGoals) })

      return healthGoals.length !== 0
        ? healthGoals.map((healthGoal) =>
            this.getMapper().toDomainModel(healthGoal)
          )
        : []
    } catch (e) {
      throw new RepositoryError(
        'HealthGoalRepository findAllByCurrentDayEndAt error',
        e as Error
      )
    }
  }
}
