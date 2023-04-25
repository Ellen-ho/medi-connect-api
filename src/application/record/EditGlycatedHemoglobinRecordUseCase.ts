import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { User } from '../../domain/user/User'

interface EditGlycatedHemoglobinRecordRequest {
  user: User
  glycatedHemoglobinRecordId: string
  glycatedHemoglobinDate: Date
  glycatedHemoglobinValuePercent: number
}

interface EditGlycatedHemoglobinRecordResponse {
  id: string
  glycatedHemoglobinDate: Date
  glycatedHemoglobinValuePercent: number
  createdAt: Date
  updatedAt: Date
}

export class EditGlycatedHemoglobinRecordUseCase {
  constructor(
    private readonly glycatedHemoglobinRecordRepository: IGlycatedHemoglobinRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: EditGlycatedHemoglobinRecordRequest
  ): Promise<EditGlycatedHemoglobinRecordResponse> {
    const {
      user,
      glycatedHemoglobinRecordId,
      glycatedHemoglobinDate,
      glycatedHemoglobinValuePercent,
    } = request

    // get patient by userId
    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    // get record by recordId and patientId
    const existingGlycatedHemoglobinRecord =
      await this.glycatedHemoglobinRecordRepository.findByIdAndPatientId(
        glycatedHemoglobinRecordId,
        existingPatient.id
      )

    if (existingGlycatedHemoglobinRecord == null) {
      throw new Error('This glycated hemoglobin record does not exist.')
    }

    existingGlycatedHemoglobinRecord.updateData({
      glycatedHemoglobinDate,
      glycatedHemoglobinValuePercent,
    })

    await this.glycatedHemoglobinRecordRepository.save(
      existingGlycatedHemoglobinRecord
    )

    return {
      id: existingGlycatedHemoglobinRecord.id,
      glycatedHemoglobinDate:
        existingGlycatedHemoglobinRecord.glycatedHemoglobinDate,
      glycatedHemoglobinValuePercent:
        existingGlycatedHemoglobinRecord.glycatedHemoglobinValuePercent,
      createdAt: existingGlycatedHemoglobinRecord.createdAt,
      updatedAt: existingGlycatedHemoglobinRecord.updatedAt,
    }
  }
}
