import { GenderType, IAllergy, Patient } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { User } from '../../domain/user/User'
import { IUserRepository } from 'domain/user/interfaces/repositories/IUserRepository'
import { NotFoundError } from 'infrastructure/error/NotFoundError'

interface CreatePatientRequest {
  user: User
}

interface CreatePatientResponse {
  id: string
}

export class CreatePatientUseCase {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly userRepository: IUserRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreatePatientRequest
  ): Promise<CreatePatientResponse> {
    const { user } = request

    const existingUser = await this.userRepository.findById(user.id)

    if (existingUser === null) {
      throw new NotFoundError('User does not exist.')
    }

    const defaultAllergy: IAllergy = {
      medicine: null,
      food: null,
      other: null,
    }

    const newPatient = new Patient({
      id: this.uuidService.generateUuid(),
      avatar: null,
      firstName: '',
      lastName: '',
      birthDate: new Date(),
      gender: GenderType.MALE,
      medicalHistory: null,
      allergy: defaultAllergy,
      familyHistory: null,
      heightValueCm: 0,
      medicineUsage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user,
    })

    await this.patientRepository.save(newPatient)

    return {
      id: newPatient.id,
    }
  }
}
