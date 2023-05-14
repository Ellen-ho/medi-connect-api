import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { User } from '../../domain/user/User'

interface GetSingleGlycatedHemoglobinRecordRequest {
  user: User
  glycatedHemoglobinRecordId: string
}

interface GetSingleGlycatedHemoglobinRecordResponse {
  data: {
    glycatedHemoglobinDate: Date
    glycatedHemoglobinValuePercent: number
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

export interface IGlycatedHemoglobinRecordWithOwner {
  id: string
  glycatedHemoglobinDate: Date
  glycatedHemoglobinValuePercent: number
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleGlycatedHemoglobinRecordUseCase {
  constructor(
    private readonly glycatedHemoglobinRecordRepository: IGlycatedHemoglobinRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: GetSingleGlycatedHemoglobinRecordRequest
  ): Promise<GetSingleGlycatedHemoglobinRecordResponse> {
    const { user, glycatedHemoglobinRecordId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const recordWithOwner =
      await this.glycatedHemoglobinRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        glycatedHemoglobinRecordId,
        existingPatient.id
      )

    if (recordWithOwner == null) {
      throw new Error('Record does not exist.')
    }

    return {
      data: {
        glycatedHemoglobinDate: recordWithOwner.glycatedHemoglobinDate,
        glycatedHemoglobinValuePercent:
          recordWithOwner.glycatedHemoglobinValuePercent,
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
