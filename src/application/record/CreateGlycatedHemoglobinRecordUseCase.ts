import dayjs from 'dayjs'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { GlycatedHemoglobinRecord } from '../../domain/record/GlycatedHemoglobinRecord'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface CreateGlycatedHemoglobinRecordRequest {
  user: User
  glycatedHemoglobinDate: Date
  glycatedHemoglobinValuePercent: number
}

interface CreateGlycatedHemoglobinRecordResponse {
  id: string
  glycatedHemoglobinDate: Date
  glycatedHemoglobinValuePercent: number
  createdAt: Date
  updatedAt: Date
}

export class CreateGlycatedHemoglobinRecordUseCase {
  constructor(
    private readonly glycatedHemoglobinRecordRepository: IGlycatedHemoglobinRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateGlycatedHemoglobinRecordRequest
  ): Promise<CreateGlycatedHemoglobinRecordResponse> {
    const { user, glycatedHemoglobinDate, glycatedHemoglobinValuePercent } =
      request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const today = dayjs().startOf('day')
    const inputDate = dayjs(glycatedHemoglobinDate).startOf('day')

    if (inputDate.isAfter(today)) {
      throw new ValidationError('The input date is not within a valid range.')
    }

    const glycatedHemoglobinDateUTC8 = dayjs(glycatedHemoglobinDate)
      .add(8, 'hour')
      .toDate()

    const existingRecord =
      await this.glycatedHemoglobinRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        glycatedHemoglobinDateUTC8
      )

    if (existingRecord !== null) {
      throw new ValidationError(
        'Only one glycated hemoglobin record can be created per day.'
      )
    }

    const glycatedHemoglobinRecord = new GlycatedHemoglobinRecord({
      id: this.uuidService.generateUuid(),
      glycatedHemoglobinDate: glycatedHemoglobinDateUTC8,
      glycatedHemoglobinValuePercent,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
    })
    await this.glycatedHemoglobinRecordRepository.save(glycatedHemoglobinRecord)

    return {
      id: glycatedHemoglobinRecord.id,
      glycatedHemoglobinDate: glycatedHemoglobinDateUTC8,
      glycatedHemoglobinValuePercent:
        glycatedHemoglobinRecord.glycatedHemoglobinValuePercent,
      createdAt: glycatedHemoglobinRecord.createdAt,
      updatedAt: glycatedHemoglobinRecord.updatedAt,
    }
  }
}
