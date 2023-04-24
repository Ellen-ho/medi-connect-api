import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import {
  GlycatedHemoglobinRecord,
  GlycatedHemoglobinUnitType,
} from '../../domain/record/GlycatedHemoglobinRecord'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateGlycatedHemoglobinRecordRequest {
  user: User
  glycatedHemoglobinDate: Date
  glycatedHemoglobinValue: number
  glycatedHemoglobinUnit: GlycatedHemoglobinUnitType
}

interface CreateGlycatedHemoglobinRecordResponse {
  id: string
  glycatedHemoglobinDate: Date
  glycatedHemoglobinValue: number
  glycatedHemoglobinUnit: GlycatedHemoglobinUnitType
  createdAt: Date
  updatedAt: Date
}

export class CreateGlycatedHemoglobinRecord {
  constructor(
    private readonly glycatedHemoglobinRecordRepository: IGlycatedHemoglobinRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateGlycatedHemoglobinRecordRequest
  ): Promise<CreateGlycatedHemoglobinRecordResponse> {
    const {
      user,
      glycatedHemoglobinDate,
      glycatedHemoglobinValue,
      glycatedHemoglobinUnit,
    } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const glycatedHemoglobinRecord = new GlycatedHemoglobinRecord({
      id: this.uuidService.generateUuid(),
      glycatedHemoglobinDate,
      glycatedHemoglobinValue,
      glycatedHemoglobinUnit,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: existingPatient,
    })
    await this.glycatedHemoglobinRecordRepository.save(glycatedHemoglobinRecord)

    return {
      id: glycatedHemoglobinRecord.id,
      glycatedHemoglobinDate: glycatedHemoglobinRecord.glycatedHemoglobinDate,
      glycatedHemoglobinValue: glycatedHemoglobinRecord.glycatedHemoglobinValue,
      glycatedHemoglobinUnit: glycatedHemoglobinRecord.glycatedHemoglobinUnit,
      createdAt: glycatedHemoglobinRecord.createdAt,
      updatedAt: glycatedHemoglobinRecord.updatedAt,
    }
  }
}
