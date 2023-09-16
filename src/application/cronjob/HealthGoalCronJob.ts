import { UserRoleType } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { IScheduler } from '../../infrastructure/network/Scheduler'
import { CancelHealthGoalUseCase } from '../goal/CancelHealthGoalUseCase'
import { CreateHealthGoalUseCase } from '../goal/CreateHealthGoalUseCase'
import schedule from 'node-schedule'

export interface IHealthGoalCronJob {
  init: () => Promise<void>
}

export class HealthGoalCronJob implements IHealthGoalCronJob {
  constructor(
    private readonly scheduler: IScheduler,
    private readonly createHealthGoalUseCase: CreateHealthGoalUseCase,
    private readonly cancelHealthGoalUseCase: CancelHealthGoalUseCase,
    private readonly userRepository: IUserRepository
  ) {}

  public async init(): Promise<void> {
    this.createPatientHealthGoalsCronJob()
    this.createCancelPatientPendingHealthGoalsCronJob()
  }

  private createPatientHealthGoalsCronJob(): void {
    const rule = new schedule.RecurrenceRule()
    rule.hour = 17
    rule.minute = 15

    const jobCallback = async (): Promise<void> => {
      await this.generatePatientHealthGoals()
    }

    this.scheduler.createJob(
      `generatePatientHealthGoals ${new Date().toISOString()}`,
      rule,
      jobCallback
    )
  }

  private async generatePatientHealthGoals(): Promise<void> {
    const existingPatients = await this.userRepository.findAllByRole(
      UserRoleType.PATIENT
    )
    if (existingPatients.length === 0) {
      throw new AuthorizationError('No patient exists')
    }

    for (const patient of existingPatients) {
      const result = await this.createHealthGoalUseCase.execute({
        user: patient,
      })

      if (result == null) {
        console.log(
          `===== NO Health Goal for ${patient.displayName} is created =====`
        )
      } else {
        console.log(
          `===== Health Goal for ${patient.displayName} is created =====`
        )
      }
    }
  }

  private createCancelPatientPendingHealthGoalsCronJob(): void {
    const rule = new schedule.RecurrenceRule()
    rule.hour = 3
    rule.minute = 0

    const jobCallback = async (): Promise<void> => {
      await this.cancelPatientHealthGoals()
    }

    this.scheduler.createJob(
      `cancelPatientHealthGoals ${new Date().toISOString()}`,
      rule,
      jobCallback
    )
  }

  private async cancelPatientHealthGoals(): Promise<void> {
    const existingPatients = await this.userRepository.findAllByRole(
      UserRoleType.PATIENT
    )
    if (existingPatients.length === 0) {
      throw new AuthorizationError('No patient exists')
    }

    for (const patient of existingPatients) {
      await this.cancelHealthGoalUseCase.execute({
        user: patient,
      })
    }
  }
}
