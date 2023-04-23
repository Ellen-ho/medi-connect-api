import { Patient } from '../../domain/patient/Patient'
import {
  BloodSugarRecord,
  BloodSugarUnitType,
} from '../../domain/record/BloodSugarRecord'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateBloodSugarRecordRequest {
  bloodSugarDate: Date
  bloodSugarValue: number
  bloodSugarNote: string | null
  bloodSugarUnit: BloodSugarUnitType
}

interface CreateBloodSugarRecordResponse {
  id: string
  bloodSugarDate: Date
  bloodSugarValue: number
  bloodSugarNote: string | null
  bloodSugarUnit: BloodSugarUnitType
  createdAt: Date
  updatedAt: Date
}

export class CreateBloodSugarRecord {
  constructor(
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateBloodSugarRecordRequest
  ): Promise<CreateBloodSugarRecordResponse> {
    const { bloodSugarDate, bloodSugarValue, bloodSugarNote, bloodSugarUnit } =
      request

    const bloodSugarRecord = new BloodSugarRecord({
      id: this.uuidService.generateUuid(),
      bloodSugarDate,
      bloodSugarValue,
      bloodSugarNote,
      bloodSugarUnit,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: new Patient(),
    })
    await this.bloodSugarRecordRepository.save(bloodSugarRecord)

    return {
      id: bloodSugarRecord.id,
      bloodSugarDate: bloodSugarRecord.bloodSugarDate,
      bloodSugarValue: bloodSugarRecord.bloodSugarValue,
      bloodSugarNote: bloodSugarRecord.bloodSugarNote,
      bloodSugarUnit: bloodSugarRecord.bloodSugarUnit,
      createdAt: bloodSugarRecord.createdAt,
      updatedAt: bloodSugarRecord.updatedAt,
    }
  }
}
