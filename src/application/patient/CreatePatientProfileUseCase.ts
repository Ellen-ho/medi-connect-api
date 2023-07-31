import {
  GenderType,
  IAllergy,
  IFamilyHistoryItem,
  IMedicalHistoryItem,
  IMedicineUsageItem,
  Patient,
} from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { User } from '../../domain/user/User'
import { ValidationError } from '../../infrastructure/error/ValidationError'

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
  medicineUsage: IMedicineUsageItem[] | null
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
      medicineUsage,
    } = request

    const existingPatientProfile = await this.patientRepository.findByUserId(
      user.id
    )

    if (existingPatientProfile !== null) {
      throw new ValidationError('Patient already exists.')
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
      medicineUsage,
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
