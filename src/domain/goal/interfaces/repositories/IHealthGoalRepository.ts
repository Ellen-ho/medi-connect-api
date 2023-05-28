import { IBaseRepository } from '../../../shared/IBaseRepository'
import { HealthGoal, HealthGoalStatus } from '../../HealthGoal'

export interface IHealthGoalRepository extends IBaseRepository<HealthGoal> {
  findById: (id: string) => Promise<HealthGoal | null>
  countsByPatientId: (patientId: string) => Promise<number>
  findByPatientIdAndStatus: (
    patientId: string,
    status: HealthGoalStatus[]
  ) => Promise<HealthGoal | null>
}
