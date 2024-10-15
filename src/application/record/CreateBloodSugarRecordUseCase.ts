import dayjs from 'dayjs'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import {
  BloodSugarRecord,
  BloodSugarType,
} from '../../domain/record/BloodSugarRecord'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

export interface CreateBloodSugarRecordRequest {
  user: User
  bloodSugarDate: Date
  bloodSugarValue: number
  bloodSugarNote: string | null
}

interface CreateBloodSugarRecordResponse {
  id: string
  bloodSugarDate: Date
  bloodSugarValue: number
  bloodSugarType: BloodSugarType
  bloodSugarNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class CreateBloodSugarRecordUseCase {
  constructor(
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateBloodSugarRecordRequest
  ): Promise<CreateBloodSugarRecordResponse> {
    const { user, bloodSugarDate, bloodSugarValue, bloodSugarNote } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const today = dayjs().startOf('day')
    const inputDate = dayjs(bloodSugarDate).startOf('day')

    if (inputDate.isAfter(today)) {
      throw new ValidationError('The input date is not within a valid range.')
    }

    const bloodugarDateUTC8 = dayjs(bloodSugarDate).add(8, 'hour').toDate()

    const existingRecord =
      await this.bloodSugarRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        bloodugarDateUTC8
      )

    if (existingRecord !== null) {
      throw new ValidationError(
        'Only one fasting blood sugar record can be created per day.'
      )
    }

    const bloodSugarRecord = new BloodSugarRecord({
      id: this.uuidService.generateUuid(),
      bloodSugarDate: bloodugarDateUTC8,
      bloodSugarValue,
      bloodSugarType: BloodSugarType.FAST_PLASMA_GLUCOSE,
      bloodSugarNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
    })
    await this.bloodSugarRecordRepository.save(bloodSugarRecord)

    return {
      id: bloodSugarRecord.id,
      bloodSugarDate: bloodugarDateUTC8,
      bloodSugarValue: bloodSugarRecord.bloodSugarValue,
      bloodSugarType: bloodSugarRecord.bloodSugarType,
      bloodSugarNote: bloodSugarRecord.bloodSugarNote,
      createdAt: bloodSugarRecord.createdAt,
      updatedAt: bloodSugarRecord.updatedAt,
    }
  }
}
