import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface EditBloodPressureRecordRequest {
  user: User
  bloodPressureRecordId: string
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
}

interface EditBloodPressureRecordResponse {
  id: string
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class EditBloodPressureRecordUseCase {
  constructor(
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: EditBloodPressureRecordRequest
  ): Promise<EditBloodPressureRecordResponse> {
    const {
      user,
      bloodPressureRecordId,
      bloodPressureDate,
      systolicBloodPressure,
      diastolicBloodPressure,
      heartBeat,
      bloodPressureNote,
    } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const existingBloodPressureRecord =
      await this.bloodPressureRecordRepository.findByIdAndPatientId(
        bloodPressureRecordId,
        existingPatient.id
      )

    if (existingBloodPressureRecord == null) {
      throw new NotFoundError('This blood pressure record does not exist.')
    }

    const depulicatedBloodPressureRecord =
      await this.bloodPressureRecordRepository.findByPatientIdAndDate(
        existingPatient.id,
        bloodPressureDate
      )

    if (depulicatedBloodPressureRecord !== null) {
      throw new ValidationError(
        "This patient's blood pressure record date is duplicated."
      )
    }

    existingBloodPressureRecord.updateData({
      bloodPressureDate,
      systolicBloodPressure,
      diastolicBloodPressure,
      heartBeat,
      bloodPressureNote,
    })

    await this.bloodPressureRecordRepository.save(existingBloodPressureRecord)

    return {
      id: existingBloodPressureRecord.id,
      bloodPressureDate: existingBloodPressureRecord.bloodPressureDate,
      systolicBloodPressure: existingBloodPressureRecord.systolicBloodPressure,
      diastolicBloodPressure:
        existingBloodPressureRecord.diastolicBloodPressure,
      heartBeat: existingBloodPressureRecord.heartBeat,
      bloodPressureNote: existingBloodPressureRecord.bloodPressureNote,
      createdAt: existingBloodPressureRecord.createdAt,
      updatedAt: existingBloodPressureRecord.updatedAt,
    }
  }
}
