import { Patient } from '../../domain/patient/Patient'
import { WeightRecord } from '../../domain/record/WeightRecord'
import { IWeightRecordRepository } from '../../domain/record/interfaces/IWeightRecordRepository'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateWeightRecordRequest {
  weightDate: Date
  weightValueKg: number
  weightNote: string | null
}

interface CreateWeightRecordResponse {
  id: string
  weightDate: Date
  weightValueKg: number
  bodyMassIndex: number
  weightNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class CreateWeightRecordRecord {
  constructor(
    private readonly weightRecordRepository: IWeightRecordRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateWeightRecordRequest
  ): Promise<CreateWeightRecordResponse> {
    const { weightDate, weightValue, weightUnit, weightNote } = request

    const weightRecord = new WeightRecord({
      id: this.uuidService.generateUuid(),
      weightDate,
      weightValue,
      weightUnit,
      bodyMassIndex: 20,
      weightNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: new Patient(),
    })
    await this.weightRecordRepository.save(weightRecord)

    return {
      id: weightRecord.id,
      weightDate: weightRecord.weightDate,
      weightValue: weightRecord.weightValue,
      weightUnit: weightRecord.weightUnit,
      bodyMassIndex: weightRecord.bodyMassIndex,
      weightNote: weightRecord.weightNote,
      createdAt: weightRecord.createdAt,
      updatedAt: weightRecord.updatedAt,
    }
  }
}
