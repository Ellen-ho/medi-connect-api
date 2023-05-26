import { IBaseRepository } from '../../../shared/IBaseRepository'
import { HealthGoal } from '../../HealthGoal'

export interface IHealthGoalRepository extends IBaseRepository<HealthGoal> {
  findById: (id: string) => Promise<HealthGoal | null>
  countsByPatientId: (patientId: string) => Promise<number>
}
