import {
  GenderType,
  IAllergy,
  IFamilyHistoryItem,
  IMedicalHistoryItem,
  IMedicinceUsageItem,
  Patient,
} from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { User } from '../../domain/user/User'

interface CreatePatientProfileRequest {
  user: User
  avatar: string | null
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
  medicalHistory: IMedicalHistoryItem[] | null
  allergy: IAllergy
  familyHistory: IFamilyHistoryItem[] | null
  heightValueCm: number
  medicinceUsage: IMedicinceUsageItem[] | null
}

interface CreatePatientProfileResponse {
  id: string
  createdAt: Date
}

export class CreatePatientProfileUseCase {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreatePatientProfileRequest
  ): Promise<CreatePatientProfileResponse> {
    const {
      user,
      avatar,
      firstName,
      lastName,
      birthDate,
      gender,
      medicalHistory,
      allergy,
      familyHistory,
      heightValueCm,
      medicinceUsage,
    } = request

    const existingPatientProfile = await this.patientRepository.findByUserId(
      user.id
    )

    if (existingPatientProfile != null) {
      throw new Error('Patient already exists.')
    }

    const patient = new Patient({
      id: this.uuidService.generateUuid(),
      avatar,
      firstName,
      lastName,
      birthDate,
      gender,
      medicalHistory,
      allergy,
      familyHistory,
      heightValueCm,
      medicinceUsage,
      createdAt: new Date(),
      updatedAt: new Date(),
      user,
    })

    await this.patientRepository.save(patient)

    return {
      id: patient.id,
      createdAt: patient.createdAt,
    }
  }
}
