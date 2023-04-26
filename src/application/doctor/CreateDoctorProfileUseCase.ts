import { IUuidService } from '../../domain/utils/IUuidService'
import { User } from '../../domain/user/User'
import {
  Doctor,
  GenderType,
  IAddress,
} from '../../domain/doctor/interfaces/Doctor'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'

interface CreateDoctorProfileRequest {
  user: User
  avatar: string | null
  firstName: string
  lastName: string
  gender: GenderType
  aboutMe: string
  languagesSpoken: string[]
  specialties: string[]
  careerStartDate: Date
  officePracticalLocation: IAddress
  education: string[]
  awards: string[] | null
  affiliations: string[] | null
}

interface CreateDoctorProfileResponse {
  id: string
  createdAt: Date
}

export class CreateDoctorProfileUseCase {
  constructor(
    private readonly doctorRepository: IDoctorRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateDoctorProfileRequest
  ): Promise<CreateDoctorProfileResponse> {
    const {
      user,
      avatar,
      firstName,
      lastName,
      gender,
      aboutMe,
      languagesSpoken,
      specialties,
      careerStartDate,
      officePracticalLocation,
      education,
      awards,
      affiliations,
    } = request

    const existingDoctorProfile = await this.doctorRepository.findByUserId(
      user.id
    )

    if (existingDoctorProfile != null) {
      throw new Error('Doctor already exists.')
    }

    const doctor = new Doctor({
      id: this.uuidService.generateUuid(),
      avatar,
      firstName,
      lastName,
      gender,
      aboutMe,
      languagesSpoken,
      specialties,
      careerStartDate,
      officePracticalLocation,
      education,
      awards,
      affiliations,
      createdAt: new Date(),
      updatedAt: new Date(),
      user,
    })

    await this.doctorRepository.save(doctor)

    return {
      id: doctor.id,
      createdAt: doctor.createdAt,
    }
  }
}
