import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { SleepQualityType } from '../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../domain/record/interfaces/repositories/ISleepRecordRepository'

import { User } from '../../domain/user/User'
import dayjs from 'dayjs'

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

    // get patient by userId
    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    // get record by recordId and patientId
    const existingSleepRecord =
      await this.sleepRecordRepository.findByIdAndPatientId(
        sleepRecordId,
        existingPatient.id
      )

    if (existingSleepRecord == null) {
      throw new Error('This sleep record does not exist.')
    }

    const depulicatedSleepRecord =
      await this.sleepRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        sleepDate
      )

    if (depulicatedSleepRecord != null) {
      throw new Error("This patient's sleep record date is duplicated.")
    }

    const sleepDurationHour: number = dayjs(wakeUpTime).diff(
      dayjs(sleepTime),
      'hour'
    )

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
