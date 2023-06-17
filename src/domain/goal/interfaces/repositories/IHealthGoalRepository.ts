import { GenderType } from '../../../patient/Patient'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import {
  HealthGoal,
  HealthGoalStatus,
  IHealthGoalResult,
} from '../../HealthGoal'

export interface IHealthGoalRepository extends IBaseRepository<HealthGoal> {
  findById: (id: string) => Promise<HealthGoal | null>
  countsByPatientId: (patientId: string) => Promise<number>
  findByPatientIdAndStatus: (
    patientId: string,
    status: HealthGoalStatus[]
  ) => Promise<HealthGoal[]>
  findByPatientIdAndCountAll: (
    patientId: string,
    limit: number,
    offset: number
  ) => Promise<{
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
  }>
  findByPatientIdAndStatusAndDateEdge: (
    patientId: string,
    status: HealthGoalStatus[],
    currentDate: Date
  ) => Promise<HealthGoal[]>
  deleteById: (id: string) => Promise<void>
}
