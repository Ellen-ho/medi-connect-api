import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { WeightRecord } from '../../domain/record/WeightRecord'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'

import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateWeightRecordRequest {
  user: User
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

export class CreateWeightRecordUseCase {
  constructor(
    private readonly weightRecordRepository: IWeightRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateWeightRecordRequest
  ): Promise<CreateWeightRecordResponse> {
    const { user, weightDate, weightValueKg, weightNote } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const weightRecord = new WeightRecord({
      id: this.uuidService.generateUuid(),
      weightDate,
      weightValueKg,
      bodyMassIndex: 20,
      weightNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: existingPatient,
    })
    await this.weightRecordRepository.save(weightRecord)

    return {
      id: weightRecord.id,
      weightDate: weightRecord.weightDate,
      weightValueKg: weightRecord.weightValueKg,
      bodyMassIndex: weightRecord.bodyMassIndex,
      weightNote: weightRecord.weightNote,
      createdAt: weightRecord.createdAt,
      updatedAt: weightRecord.updatedAt,
    }
  }
}
