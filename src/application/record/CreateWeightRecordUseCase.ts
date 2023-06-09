import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { WeightRecord } from '../../domain/record/WeightRecord'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { calculateBodyMassIndex } from '../../domain/utils/healthFormula'

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

    // get patient by userId
    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const bodyMassIndex = calculateBodyMassIndex({
      weightValueKg,
      heightValueCm: existingPatient.heightValueCm,
    })

    const existingRecord =
      await this.weightRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        weightDate
      )

    if (existingRecord != null) {
      throw new Error('Only one weight record can be created per day.')
    }

    const weightRecord = new WeightRecord({
      id: this.uuidService.generateUuid(),
      weightDate,
      weightValueKg,
      bodyMassIndex,
      weightNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
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
