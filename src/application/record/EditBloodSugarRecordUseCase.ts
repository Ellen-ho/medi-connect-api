import dayjs from 'dayjs'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'

import { User } from '../../domain/user/User'
import { AuthenticationError } from '../../infrastructure/error/AuthenticationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface EditBloodSugarRecordRequest {
  user: User
  bloodSugarRecordId: string
  bloodSugarDate: Date
  bloodSugarValue: number
  bloodSugarNote: string | null
}

interface EditBloodSugarRecordResponse {
  id: string
  bloodSugarDate: Date
  bloodSugarValue: number // mg/L
  bloodSugarType: BloodSugarType
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
      bloodSugarValue,
      bloodSugarNote,
    } = request

    // get patient by userId
    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthenticationError('Patient does not exist.')
    }

    // get record by recordId and patientId
    const existingBloodSugarRecord =
      await this.bloodSugarRecordRepository.findByIdAndPatientId(
        bloodSugarRecordId,
        existingPatient.id
      )

    if (existingBloodSugarRecord == null) {
      throw new NotFoundError('This blood sugar record does not exist.')
    }

    if (
      !dayjs(bloodSugarDate).isSame(
        existingBloodSugarRecord.bloodSugarDate,
        'day'
      )
    ) {
      const duplicatedBloodSugarRecord =
        await this.bloodSugarRecordRepository.findByPatientIdAndDate(
          existingPatient.id,
          bloodSugarDate
        )
      if (duplicatedBloodSugarRecord !== null) {
        throw new ValidationError('The blood sugar record date is duplicated.')
      }
    }

    existingBloodSugarRecord.updateData({
      bloodSugarDate,
      bloodSugarValue,
      bloodSugarNote,
    })

    await this.bloodSugarRecordRepository.save(existingBloodSugarRecord)

    return {
      id: existingBloodSugarRecord.id,
      bloodSugarDate: existingBloodSugarRecord.bloodSugarDate,
      bloodSugarValue: existingBloodSugarRecord.bloodSugarValue,
      bloodSugarType: existingBloodSugarRecord.bloodSugarType,
      bloodSugarNote: existingBloodSugarRecord.bloodSugarNote,
      createdAt: existingBloodSugarRecord.createdAt,
      updatedAt: existingBloodSugarRecord.updatedAt,
    }
  }
}
