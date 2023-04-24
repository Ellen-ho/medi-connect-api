import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { User } from '../../domain/user/User'
import { calculateBodyMassIndex } from '../../domain/utils/healthFormula'

interface EditWeightRecordRequest {
  user: User
  weightRecordId: string
  weightDate: Date
  weightValueKg: number
  weightNote: string | null
}

interface EditWeightRecordResponse {
  id: string
  weightDate: Date
  weightValueKg: number
  bodyMassIndex: number
  weightNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class EditWeightRecordUseCase {
  constructor(
    private readonly weightRecordRepository: IWeightRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: EditWeightRecordRequest
  ): Promise<EditWeightRecordResponse> {
    const { user, weightRecordId, weightDate, weightValueKg, weightNote } =
      request

    // get patient by userId
    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    // get record by recordId and patientId
    const existingWeightRecord =
      await this.weightRecordRepository.findByIdAndPatientId(
        weightRecordId,
        existingPatient.id
      )

    if (existingWeightRecord == null) {
      throw new Error('This weight record does not exist.')
    }

    const bodyMassIndex = calculateBodyMassIndex({
      weightValueKg,
      heightValueCm: existingPatient.heightValueCm,
    })

    existingWeightRecord.updateData({
      weightDate,
      weightValueKg,
      bodyMassIndex,
      weightNote,
    })

    await this.weightRecordRepository.save(existingWeightRecord)

    return {
      id: existingWeightRecord.id,
      weightDate: existingWeightRecord.weightDate,
      weightValueKg: existingWeightRecord.weightValueKg,
      bodyMassIndex: existingWeightRecord.bodyMassIndex,
      weightNote: existingWeightRecord.weightNote,
      createdAt: existingWeightRecord.createdAt,
      updatedAt: existingWeightRecord.updatedAt,
    }
  }
}
