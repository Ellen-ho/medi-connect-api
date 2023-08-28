import { IUuidService } from '../../domain/utils/IUuidService'
import { User } from '../../domain/user/User'
import { Doctor, GenderType, IAddress } from '../../domain/doctor/Doctor'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface CreateDoctorProfileRequest {
  user: User
  avatar: string | null
  firstName: string
  lastName: string
  gender: GenderType
  aboutMe: string
  languagesSpoken: string[]
  specialties: MedicalSpecialtyType[]
  careerStartDate: Date
  officePracticalLocation: IAddress
  education: string[]
  awards: string[] | null
  affiliations: string[] | null
}

interface CreateDoctorProfileResponse {
  id: string
  avatar: string | null
  firstName: string
  lastName: string
  gender: GenderType
  aboutMe: string
  languagesSpoken: string[]
  specialties: MedicalSpecialtyType[]
  careerStartDate: Date
  officePracticalLocation: IAddress
  education: string[]
  awards: string[] | null
  affiliations: string[] | null
  createdAt: Date
  updatedAt: Date
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

    if (existingDoctorProfile !== null) {
      throw new ValidationError('Doctor already exists.')
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
      avatar: doctor.avatar,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      gender: doctor.gender,
      aboutMe: doctor.aboutMe,
      languagesSpoken: doctor.languagesSpoken,
      careerStartDate: doctor.careerStartDate,
      specialties: doctor.specialties,
      officePracticalLocation: doctor.officePracticalLocation,
      education: doctor.education,
      awards: doctor.awards,
      affiliations: doctor.affiliations,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    }
  }
}
