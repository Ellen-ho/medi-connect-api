import {
  GenderType,
  HeightUnitType,
  IAllergy,
  IFamilyHistoryItem,
  IMedicalHistoryItem,
  IMedicinceUsageItem,
} from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'

interface EditPatientProfileRequest {
  avatar: string | null
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
  medicalHistory: IMedicalHistoryItem[] | null
  allergy: IAllergy
  familyHistory: IFamilyHistoryItem[] | null
  height: number
  heightUnit: HeightUnitType
  medicinceUsage: IMedicinceUsageItem[] | null
  user: User
}

interface EditPatientProfileResponse {
  id: string
  avatar: string | null
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
  medicalHistory: IMedicalHistoryItem[] | null
  allergy: IAllergy
  familyHistory: IFamilyHistoryItem[] | null
  height: number
  heightUnit: HeightUnitType
  medicinceUsage: IMedicinceUsageItem[] | null
  createdAt: Date
  updatedAt: Date
}

export class EditPatientProfileUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  public async execute(
    request: EditPatientProfileRequest
  ): Promise<EditPatientProfileResponse> {
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
      height,
      heightUnit,
      medicinceUsage,
    } = request

    const existingPatientProfile = await this.patientRepository.findByUserId(
      user.id
    )

    if (existingPatientProfile == null) {
      throw new Error('Patient does not exist.')
    }

    existingPatientProfile.updateData({
      avatar,
      firstName,
      lastName,
      birthDate,
      gender,
      medicalHistory,
      allergy,
      familyHistory,
      height,
      heightUnit,
      medicinceUsage,
    })

    await this.patientRepository.save(existingPatientProfile)

    return {
      id: existingPatientProfile.id,
      avatar: existingPatientProfile.avatar,
      firstName: existingPatientProfile.firstName,
      lastName: existingPatientProfile.lastName,
      birthDate: existingPatientProfile.birthDate,
      gender: existingPatientProfile.gender,
      medicalHistory: existingPatientProfile.medicalHistory,
      allergy: existingPatientProfile.allergy,
      familyHistory: existingPatientProfile.familyHistory,
      height: existingPatientProfile.height,
      heightUnit: existingPatientProfile.heightUnit,
      medicinceUsage: existingPatientProfile.medicinceUsage,
      createdAt: existingPatientProfile.createdAt,
      updatedAt: existingPatientProfile.updatedAt,
    }
  }
}
