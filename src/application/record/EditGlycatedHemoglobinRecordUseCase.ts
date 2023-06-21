import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

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

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const existingGlycatedHemoglobinRecord =
      await this.glycatedHemoglobinRecordRepository.findByIdAndPatientId(
        glycatedHemoglobinRecordId,
        existingPatient.id
      )

    if (existingGlycatedHemoglobinRecord == null) {
      throw new NotFoundError('This glycated hemoglobin record does not exist.')
    }

    const depulicatedGlycatedHemoglobinRecord =
      await this.glycatedHemoglobinRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        glycatedHemoglobinDate
      )

    if (depulicatedGlycatedHemoglobinRecord !== null) {
      throw new ValidationError(
        "This patient's glycatedHemoglobin record date is duplicated."
      )
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
