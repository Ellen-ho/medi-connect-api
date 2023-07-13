import {
  GenderType,
  IAllergy,
  IFamilyHistoryItem,
  IMedicalHistoryItem,
  IMedicinceUsageItem,
} from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetPatientProfileRequest {
  user: User
}

interface GetPatientProfileResponse {
  id: string
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
  createdAt: Date
  updatedAt: Date
}

export class GetPatientProfileUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  public async execute(
    request: GetPatientProfileRequest
  ): Promise<GetPatientProfileResponse> {
    const { user } = request

    const existingPatientProfile = await this.patientRepository.findByUserId(
      user.id
    )

    if (existingPatientProfile == null) {
      throw new NotFoundError(
        'The current patient whose profile does not exist.'
      )
    }

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
      heightValueCm: existingPatientProfile.heightValueCm,
      medicinceUsage: existingPatientProfile.medicinceUsage,
      createdAt: existingPatientProfile.createdAt,
      updatedAt: existingPatientProfile.updatedAt,
    }
  }
}
