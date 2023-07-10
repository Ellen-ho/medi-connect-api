import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { SleepQualityType } from '../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../domain/record/interfaces/repositories/ISleepRecordRepository'

import { User } from '../../domain/user/User'
import dayjs from 'dayjs'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface EditSleepRecordRequest {
  user: User
  sleepRecordId: string
  sleepDate: Date
  sleepTime: Date
  wakeUpTime: Date
  sleepQuality: SleepQualityType
  sleepNote: string | null
}

interface EditSleepRecordResponse {
  id: string
  sleepDate: Date
  sleepTime: Date
  wakeUpTime: Date
  sleepDurationHour: number
  sleepQuality: SleepQualityType
  sleepNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class EditSleepRecordUseCase {
  constructor(
    private readonly sleepRecordRepository: ISleepRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: EditSleepRecordRequest
  ): Promise<EditSleepRecordResponse> {
    const {
      user,
      sleepRecordId,
      sleepDate,
      sleepTime,
      wakeUpTime,
      sleepQuality,
      sleepNote,
    } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const existingSleepRecord =
      await this.sleepRecordRepository.findByIdAndPatientId(
        sleepRecordId,
        existingPatient.id
      )

    if (existingSleepRecord == null) {
      throw new NotFoundError('This sleep record does not exist.')
    }

    if (!dayjs(sleepDate).isSame(existingSleepRecord.sleepDate, 'day')) {
      const duplicatedSleepRecord =
        await this.sleepRecordRepository.findByPatientIdAndDate(
          existingPatient.id,
          sleepDate
        )
      if (duplicatedSleepRecord !== null) {
        throw new ValidationError('The sleep record date is duplicated.')
      }
    }

    const sleepDuration: number =
      dayjs(wakeUpTime).diff(dayjs(sleepTime), 'minute') / 60
    const sleepDurationHour: number = Math.round(sleepDuration * 10) / 10

    existingSleepRecord.updateData({
      sleepDate,
      sleepTime,
      wakeUpTime,
      sleepDurationHour,
      sleepQuality,
      sleepNote,
    })

    await this.sleepRecordRepository.save(existingSleepRecord)

    return {
      id: existingSleepRecord.id,
      sleepDate: existingSleepRecord.sleepDate,
      sleepTime: existingSleepRecord.sleepTime,
      wakeUpTime: existingSleepRecord.wakeUpTime,
      sleepDurationHour: existingSleepRecord.sleepDurationHour,
      sleepQuality: existingSleepRecord.sleepQuality,
      sleepNote: existingSleepRecord.sleepNote,
      createdAt: existingSleepRecord.createdAt,
      updatedAt: existingSleepRecord.updatedAt,
    }
  }
}
