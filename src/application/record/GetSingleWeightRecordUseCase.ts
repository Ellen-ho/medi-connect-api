import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { User } from '../../domain/user/User'

interface GetSingleWeightRecordRequest {
  user: User
  weightRecordId: string
}

interface GetSingleWeightRecordResponse {
  data: {
    weightDate: Date
    weightValueKg: number
    bodyMassIndex: number
    weightNote: string | null
    createdAt: Date
    updatedAt: Date
  }
  recordOwner: IRecordOwner
}

export interface IRecordOwner {
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
}

export interface IWeightRecordWithOwner {
  id: string
  weightDate: Date
  weightValueKg: number
  bodyMassIndex: number
  weightNote: string | null
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleWeightRecordUseCase {
  constructor(
    private readonly weightRecordRepository: IWeightRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: GetSingleWeightRecordRequest
  ): Promise<GetSingleWeightRecordResponse> {
    const { user, weightRecordId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const recordWithOwner =
      await this.weightRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        weightRecordId,
        existingPatient.id
      )

    if (recordWithOwner == null) {
      throw new Error('Record does not exist.')
    }

    return {
      data: {
        weightDate: recordWithOwner.weightDate,
        weightValueKg: recordWithOwner.weightValueKg,
        bodyMassIndex: recordWithOwner.bodyMassIndex,
        weightNote: recordWithOwner.weightNote,
        createdAt: recordWithOwner.createdAt,
        updatedAt: recordWithOwner.updatedAt,
      },
      recordOwner: {
        firstName: recordWithOwner.patientFirstName,
        lastName: recordWithOwner.patientLastName,
        birthDate: recordWithOwner.patientBirthDate,
        gender: recordWithOwner.patientGender,
      },
    }
  }
}
