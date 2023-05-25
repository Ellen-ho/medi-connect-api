import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { User } from '../../domain/user/User'

interface GetSingleBloodSugarRecordRequest {
  user: User
  bloodSugarRecordId: string
}

interface GetSingleBloodSugarRecordResponse {
  data: {
    bloodSugarDate: Date
    bloodSugarValue: number
    bloodSugarType: BloodSugarType
    bloodSugarNote: string | null
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

export interface IBloodSugarRecordWithOwner {
  id: string
  bloodSugarDate: Date
  bloodSugarValue: number
  bloodSugarType: BloodSugarType
  bloodSugarNote: string | null
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleBloodSugarRecordUseCase {
  constructor(
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: GetSingleBloodSugarRecordRequest
  ): Promise<GetSingleBloodSugarRecordResponse> {
    const { user, bloodSugarRecordId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const recordWithOwner =
      await this.bloodSugarRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        bloodSugarRecordId,
        existingPatient.id
      )

    if (recordWithOwner == null) {
      throw new Error('Record does not exist.')
    }

    return {
      data: {
        bloodSugarDate: recordWithOwner.bloodSugarDate,
        bloodSugarValue: recordWithOwner.bloodSugarValue,
        bloodSugarType: recordWithOwner.bloodSugarType,
        bloodSugarNote: recordWithOwner.bloodSugarNote,
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
