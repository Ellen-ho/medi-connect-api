import { Patient } from '../../domain/patient/Patient'
import { SleepQualityType, SleepRecord } from '../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../domain/record/interfaces/repositories/ISleepRecordRepository'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateSleepRecordRequestDTO {
  sleepDate: Date
  sleepTime: Date
  wakeUpTime: Date
  sleepQuality: SleepQualityType
  sleepDurationHour: number
  sleepNote: string | null
}

interface CreateSleepRecordResponseDTO {
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

export class CreateSleepRecord {
  constructor(
    private readonly sleepRecordRepository: ISleepRecordRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateSleepRecordRequestDTO
  ): Promise<CreateSleepRecordResponseDTO> {
    const {
      sleepDate,
      sleepTime,
      wakeUpTime,
      sleepQuality,
      sleepDurationHour,
      sleepNote,
    } = request

    const sleepRecord = new SleepRecord({
      id: this.uuidService.generateUuid(),
      sleepDate,
      sleepTime,
      wakeUpTime,
      sleepQuality,
      sleepDurationHour,
      sleepNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: new Patient(),
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
      patient: sleepRecord.patient,
    }
  }
}
