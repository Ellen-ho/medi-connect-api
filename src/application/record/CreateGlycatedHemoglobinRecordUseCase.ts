import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { GlycatedHemoglobinRecord } from '../../domain/record/GlycatedHemoglobinRecord'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

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
      throw new Error('Patient does not exist.')
    }

    const glycatedHemoglobinRecord = new GlycatedHemoglobinRecord({
      id: this.uuidService.generateUuid(),
      glycatedHemoglobinDate,
      glycatedHemoglobinValuePercent,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
    })
    await this.glycatedHemoglobinRecordRepository.save(glycatedHemoglobinRecord)

    return {
      id: glycatedHemoglobinRecord.id,
      glycatedHemoglobinDate: glycatedHemoglobinRecord.glycatedHemoglobinDate,
      glycatedHemoglobinValuePercent:
        glycatedHemoglobinRecord.glycatedHemoglobinValuePercent,
      createdAt: glycatedHemoglobinRecord.createdAt,
      updatedAt: glycatedHemoglobinRecord.updatedAt,
    }
  }
}
