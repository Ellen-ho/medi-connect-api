import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { SleepQualityType, SleepRecord } from '../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../domain/record/interfaces/repositories/ISleepRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import dayjs from 'dayjs'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface CreateSleepRecordRequest {
  user: User
  sleepDate: Date
  sleepTime: Date
  wakeUpTime: Date
  sleepQuality: SleepQualityType
  sleepNote: string | null
}

interface CreateSleepRecordResponse {
  id: string
  sleepDate: Date
  sleepTime: Date
  wakeUpTime: Date
  sleepQuality: SleepQualityType
  sleepDurationHour: number
  sleepNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class CreateSleepRecordUseCase {
  constructor(
    private readonly sleepRecordRepository: ISleepRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateSleepRecordRequest
  ): Promise<CreateSleepRecordResponse> {
    const { user, sleepDate, sleepTime, wakeUpTime, sleepQuality, sleepNote } =
      request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const today = dayjs().startOf('day')
    const inputDate = dayjs(sleepDate).startOf('day')

    if (inputDate.isAfter(today)) {
      throw new ValidationError('The input date is not within a valid range.')
    }

    const sleepDateUTC8 = dayjs(sleepDate).add(8, 'hour').toDate()

    const sleepDuration: number =
      dayjs(wakeUpTime).diff(dayjs(sleepTime), 'minute') / 60
    const sleepDurationHour: number = Math.round(sleepDuration * 10) / 10

    const existingRecord =
      await this.sleepRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        sleepDateUTC8
      )

    if (existingRecord !== null) {
      throw new ValidationError('Only one sleep record can be created per day.')
    }

    const sleepRecord = new SleepRecord({
      id: this.uuidService.generateUuid(),
      sleepDate: sleepDateUTC8,
      sleepTime,
      wakeUpTime,
      sleepQuality,
      sleepDurationHour,
      sleepNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
    })
    await this.sleepRecordRepository.save(sleepRecord)

    return {
      id: sleepRecord.id,
      sleepDate: sleepDateUTC8,
      sleepTime: sleepRecord.sleepTime,
      wakeUpTime: sleepRecord.wakeUpTime,
      sleepQuality: sleepRecord.sleepQuality,
      sleepDurationHour: sleepRecord.sleepDurationHour,
      sleepNote: sleepRecord.sleepNote,
      createdAt: sleepRecord.createdAt,
      updatedAt: sleepRecord.updatedAt,
    }
  }
}
