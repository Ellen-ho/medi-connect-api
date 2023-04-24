import {
  GenderType,
  HeightUnitType,
  IAllergy,
  IFamilyHistoryItem,
  IMedicalHistoryItem,
  IMedicinceUsageItem,
  Patient,
} from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreatePatientProfileRequest {
  userId: string
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
      userId,
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

    const patientProfileExists = await this.patientRepository.findById(userId)

    if (patientProfileExists != null) {
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
      height,
      heightUnit,
      medicinceUsage,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.patientRepository.save(patient)

    return {
      id: patient.id,
      createdAt: patient.createdAt,
    }
  }
}
