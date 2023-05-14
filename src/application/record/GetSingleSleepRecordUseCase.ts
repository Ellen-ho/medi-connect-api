import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { SleepQualityType } from '../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../domain/record/interfaces/repositories/ISleepRecordRepository'
import { User } from '../../domain/user/User'

interface GetSingleSleepRecordRequest {
  user: User
  sleepRecordId: string
}

interface GetSingleSleepRecordResponse {
  data: {
    sleepDate: Date
    sleepTime: Date
    wakeUpTime: Date
    sleepQuality: SleepQualityType
    sleepDurationHour: number
    sleepNote: string | null
    createdAt: Date
    updatedAt: Date
  }
  recordOwner: IRecordOwner
}

export interface IRecordOwner {
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
}

export interface ISleepRecordWithOwner {
  id: string
  sleepDate: Date
  sleepTime: Date
  wakeUpTime: Date
  sleepQuality: SleepQualityType
  sleepDurationHour: number
  sleepNote: string | null
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleSleepRecordUseCase {
  constructor(
    private readonly sleepRecordRepository: ISleepRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: GetSingleSleepRecordRequest
  ): Promise<GetSingleSleepRecordResponse> {
    const { user, sleepRecordId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const recordWithOwner =
      await this.sleepRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        sleepRecordId,
        existingPatient.id
      )

    if (recordWithOwner == null) {
      throw new Error('Record does not exist.')
    }

    return {
      data: {
        sleepDate: recordWithOwner.sleepDate,
        sleepTime: recordWithOwner.sleepTime,
        wakeUpTime: recordWithOwner.wakeUpTime,
        sleepQuality: recordWithOwner.sleepQuality,
        sleepDurationHour: recordWithOwner.sleepDurationHour,
        sleepNote: recordWithOwner.sleepNote,
        createdAt: recordWithOwner.createdAt,
        updatedAt: recordWithOwner.updatedAt,
      },
      recordOwner: {
        firstName: recordWithOwner.patientFirstName,
        lastName: recordWithOwner.patientLastName,
        birthDate: recordWithOwner.patientBirthDate,
        gender: recordWithOwner.patientGender,
      },
    }
  }
}
