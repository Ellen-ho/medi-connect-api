import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { User } from '../../domain/user/User'

interface GetSingleBloodPressureRecordRequest {
  user: User
  bloodPressureRecordId: string
}

interface GetSingleBloodPressureRecordResponse {
  data: {
    bloodPressureDate: Date
    systolicBloodPressure: number
    diastolicBloodPressure: number
    heartBeat: number
    bloodPressureNote: string | null
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

export interface IBloodPressureRecordWithOwner {
  id: string
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleBloodPressureRecordUseCase {
  constructor(
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: GetSingleBloodPressureRecordRequest
  ): Promise<GetSingleBloodPressureRecordResponse> {
    const { user, bloodPressureRecordId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const recordWithOwner =
      await this.bloodPressureRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        bloodPressureRecordId,
        existingPatient.id
      )

    if (recordWithOwner == null) {
      throw new Error('Record does not exist.')
    }

    return {
      data: {
        bloodPressureDate: recordWithOwner.bloodPressureDate,
        systolicBloodPressure: recordWithOwner.systolicBloodPressure,
        diastolicBloodPressure: recordWithOwner.diastolicBloodPressure,
        heartBeat: recordWithOwner.heartBeat,
        bloodPressureNote: recordWithOwner.bloodPressureNote,
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
