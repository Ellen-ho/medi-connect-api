import { IAddress } from '../../domain/doctor/Doctor'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { User } from '../../domain/user/User'

interface EditDoctorProfileRequest {
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
  user: User
}

interface EditDoctorProfileResponse {
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

export class EditDoctorProfileUseCase {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  public async execute(
    request: EditDoctorProfileRequest
  ): Promise<EditDoctorProfileResponse> {
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

    if (existingDoctorProfile == null) {
      throw new Error('Doctor does not exist.')
    }

    existingDoctorProfile.updateData({
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
    })

    await this.doctorRepository.save(existingDoctorProfile)

    return {
      id: existingDoctorProfile.id,
      avatar: existingDoctorProfile.avatar,
      firstName: existingDoctorProfile.firstName,
      lastName: existingDoctorProfile.lastName,
      gender: existingDoctorProfile.gender,
      aboutMe: existingDoctorProfile.aboutMe,
      languagesSpoken: existingDoctorProfile.languagesSpoken,
      careerStartDate: existingDoctorProfile.careerStartDate,
      specialties: existingDoctorProfile.specialties,
      officePracticalLocation: existingDoctorProfile.officePracticalLocation,
      education: existingDoctorProfile.education,
      awards: existingDoctorProfile.awards,
      affiliations: existingDoctorProfile.affiliations,
      createdAt: existingDoctorProfile.createdAt,
      updatedAt: existingDoctorProfile.updatedAt,
    }
  }
}
