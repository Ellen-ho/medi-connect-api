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
}
//   public async bloodSugarCountByPatientId(
//     patientId: string
//   ): Promise<number | null> {
//     try {
//       const bloodSugarRawCounts = await this.getQuery<Array<{ count: number }>>(
//         `SELECT
//   health_goals.*,
//   CASE
//     WHEN (
//       SELECT COUNT(*)
//       FROM blood_sugar_records
//       WHERE patient_id = health_goals.patient_id
//         AND fasting = true
//         AND blood_sugar_records_created_at >= (SELECT MAX(health_goals.created_at) - INTERVAL '6 days' FROM health_goals)
//     ) >= 7
//     THEN (
//       SELECT AVG(value)
//       FROM blood_sugar_records
//       WHERE patient_id = health_goals.patient_id
//         AND fasting = true
//         AND blood_sugar_records_created_at >= (SELECT MAX(blood_sugar_records_created_at) - INTERVAL '6 days' FROM blood_sugar_records)
//     )
//     ELSE NULL
//   END AS average_fasting_blood_sugar
// FROM health_goals
// WHERE created_at >= (SELECT MAX(blood_sugar_records_created_at) - INTERVAL '6 days' FROM blood_sugar_records)`,
//         [patientId]
//       )
//       return bloodSugarRawCounts[0].count
//     } catch (e) {
//       throw new RepositoryError(
//         'HealthGoalEntity bloodSugarCountByPatientId error',
//         e as Error
//       )
//     }
//   }

//   public async weightRawCountByPatientId(
//     patientId: string
//   ): Promise<number | null> {
//     try {
//       const weightRawCounts = await this.getQuery<Array<{ count: number }>>(
//         `SELECT
//   health_goals.*,
//   CASE
//     WHEN (
//       SELECT COUNT(*)
//       FROM weight_records
//       WHERE patient_id = health_goals.patient_id
//         AND weight_records_created_at >= (SELECT MAX(health_goals.created_at) - INTERVAL '6 days' FROM health_goals)
//     ) >= 7
//     THEN (
//       SELECT AVG(weight_value)
//       FROM weight_records
//       WHERE patient_id = health_goals.patient_id
//         AND weight_records_created_at >= (SELECT MAX(weight_records_created_at) - INTERVAL '6 days' FROM weight_records)
//     )
//     ELSE NULL
//   END AS average_weight_value
// FROM health_goals
// WHERE created_at >= (SELECT MAX(weight_records_created_at) - INTERVAL '6 days' FROM weight_records)`,
//         [patientId]
//       )
//       return weightRawCounts[0].count
//     } catch (e) {
//       throw new RepositoryError(
//         'HealthGoalEntity weightCountByPatientId error',
//         e as Error
//       )
//     }
//   }
// }
