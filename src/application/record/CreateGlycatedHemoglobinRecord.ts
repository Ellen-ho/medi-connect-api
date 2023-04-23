import { Patient } from '../../domain/patient/Patient'
import {
  GlycatedHemoglobinRecord,
  GlycatedHemoglobinUnitType,
} from '../../domain/record/GlycatedHemoglobinRecord'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateGlycatedHemoglobinRecordRequest {
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
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateGlycatedHemoglobinRecordRequest
  ): Promise<CreateGlycatedHemoglobinRecordResponse> {
    const {
      glycatedHemoglobinDate,
      glycatedHemoglobinValue,
      glycatedHemoglobinUnit,
    } = request

    const glycatedHemoglobinRecord = new GlycatedHemoglobinRecord({
      id: this.uuidService.generateUuid(),
      glycatedHemoglobinDate,
      glycatedHemoglobinValue,
      glycatedHemoglobinUnit,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: new Patient(),
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
