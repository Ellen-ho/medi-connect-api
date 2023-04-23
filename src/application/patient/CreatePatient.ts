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

interface CreatePatientRequestDTO {
  avatar: string
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
  medicalHistory: IMedicalHistoryItem[]
  allergy: IAllergy
  familyHistory: IFamilyHistoryItem[]
  height: number
  heightUnit: HeightUnitType
  medicinceUsage: IMedicinceUsageItem[]
}

interface CreatePatientResponseDTO {
  id: string
  avatar: string
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
  medicalHistory: IMedicalHistoryItem[]
  allergy: IAllergy
  familyHistory: IFamilyHistoryItem[]
  height: number
  heightUnit: HeightUnitType
  medicinceUsage: IMedicinceUsageItem[]
  createdAt: Date
  updatedAt: Date
}

export class CreatePatient {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreatePatientRequestDTO
  ): Promise<CreatePatientResponseDTO> {
    const {
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

    const patientExists = await this.patientRepository.findById(id)

    if (patientExists != null) {
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
      avatar: patient.avatar,
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate,
      gender: patient.gender,
      medicalHistory: patient.medicalHistory,
      allergy: patient.allergy,
      familyHistory: patient.familyHistory,
      height: patient.height,
      heightUnit: patient.heightUnit,
      medicinceUsage: patient.medicinceUsage,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    }
  }
}
