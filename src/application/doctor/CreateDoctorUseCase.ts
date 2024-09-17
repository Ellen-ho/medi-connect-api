import { Doctor, IAddress } from '../../domain/doctor/Doctor'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface CreateDoctorRequest {
  user: User
}

interface CreateDoctorResponse {
  id: string
}

export class CreateDoctorUseCase {
  constructor(
    private readonly doctorRepository: IDoctorRepository,
    private readonly userRepository: IUserRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateDoctorRequest
  ): Promise<CreateDoctorResponse> {
    const { user } = request
    const existingUser = await this.userRepository.findById(user.id)

    if (existingUser === null) {
      throw new NotFoundError('User does not exist.')
    }

    const defaultAddress: IAddress = {
      line1: '',
      line2: '',
      city: '',
      stateProvince: '',
      postalCode: '',
      country: '',
      countryCode: '',
    }

    const newDoctor = new Doctor({
      id: this.uuidService.generateUuid(),
      avatar: null,
      firstName: '',
      lastName: 'string',
      gender: GenderType.MALE,
      aboutMe: '',
      languagesSpoken: [],
      specialties: [],
      careerStartDate: new Date(),
      officePracticalLocation: defaultAddress,
      education: [],
      awards: null,
      affiliations: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user,
    })

    await this.doctorRepository.save(newDoctor)

    return {
      id: newDoctor.id,
    }
  }
}
