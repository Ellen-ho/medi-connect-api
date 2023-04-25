import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'

import { User } from '../../domain/user/User'

interface EditBloodSugarRecordRequest {
  user: User
  bloodSugarRecordId: string
  bloodSugarDate: Date
  bloodSugarValueMmo: number // mmol/L
  bloodSugarNote: string | null
}

interface EditBloodSugarRecordResponse {
  id: string
  bloodSugarDate: Date
  bloodSugarValueMmo: number // mmol/L
  bloodSugarNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class EditBloodSugarRecordUseCase {
  constructor(
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: EditBloodSugarRecordRequest
  ): Promise<EditBloodSugarRecordResponse> {
    const {
      user,
      bloodSugarRecordId,
      bloodSugarDate,
      bloodSugarValueMmo,
      bloodSugarNote,
    } = request

    // get patient by userId
    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    // get record by recordId and patientId
    const existingBloodSugarRecord =
      await this.bloodSugarRecordRepository.findByIdAndPatientId(
        bloodSugarRecordId,
        existingPatient.id
      )

    if (existingBloodSugarRecord == null) {
      throw new Error('This blood sugar record does not exist.')
    }

    existingBloodSugarRecord.updateData({
      bloodSugarDate,
      bloodSugarValueMmo,
      bloodSugarNote,
    })

    await this.bloodSugarRecordRepository.save(existingBloodSugarRecord)

    return {
      id: existingBloodSugarRecord.id,
      bloodSugarDate: existingBloodSugarRecord.bloodSugarDate,
      bloodSugarValueMmo: existingBloodSugarRecord.bloodSugarValueMmo,
      bloodSugarNote: existingBloodSugarRecord.bloodSugarNote,
      createdAt: existingBloodSugarRecord.createdAt,
      updatedAt: existingBloodSugarRecord.updatedAt,
    }
  }
}
