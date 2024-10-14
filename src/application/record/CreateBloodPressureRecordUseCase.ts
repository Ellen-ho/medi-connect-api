import dayjs from 'dayjs'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodPressureRecord } from '../../domain/record/BloodPressureRecord'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { ValidationError } from '../../infrastructure/error/ValidationError'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

interface CreateBloodPressureRecordRequest {
  user: User
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
}

interface CreateBloodPressureRecordResponse {
  id: string
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class CreateBloodPressureRecordUseCase {
  constructor(
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateBloodPressureRecordRequest
  ): Promise<CreateBloodPressureRecordResponse> {
    const {
      user,
      bloodPressureDate,
      systolicBloodPressure,
      diastolicBloodPressure,
      heartBeat,
      bloodPressureNote,
    } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const existingRecord =
      await this.bloodPressureRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        bloodPressureDate
      )

    if (existingRecord !== null) {
      throw new ValidationError(
        'Only one blood pressure record can be created per day.'
      )
    }

    const bloodPressureRecord = new BloodPressureRecord({
      id: this.uuidService.generateUuid(),
      bloodPressureDate,
      systolicBloodPressure,
      diastolicBloodPressure,
      bloodPressureNote,
      heartBeat,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
    })
    await this.bloodPressureRecordRepository.save(bloodPressureRecord)

    return {
      id: bloodPressureRecord.id,
      bloodPressureDate: bloodPressureRecord.bloodPressureDate,
      systolicBloodPressure: bloodPressureRecord.systolicBloodPressure,
      diastolicBloodPressure: bloodPressureRecord.diastolicBloodPressure,
      bloodPressureNote: bloodPressureRecord.bloodPressureNote,
      heartBeat: bloodPressureRecord.heartBeat,
      createdAt: bloodPressureRecord.createdAt,
      updatedAt: bloodPressureRecord.updatedAt,
    }
  }
}
