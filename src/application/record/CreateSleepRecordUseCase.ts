import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { SleepQualityType, SleepRecord } from '../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../domain/record/interfaces/repositories/ISleepRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

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
      throw new Error('Patient does not exist.')
    }

    const sleepRecord = new SleepRecord({
      id: this.uuidService.generateUuid(),
      sleepDate,
      sleepTime,
      wakeUpTime,
      sleepQuality,
      sleepDurationHour: 0, // TODO: Calculate sleep duration
      sleepNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
    })
    await this.sleepRecordRepository.save(sleepRecord)

    return {
      id: sleepRecord.id,
      sleepDate: sleepRecord.sleepDate,
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
