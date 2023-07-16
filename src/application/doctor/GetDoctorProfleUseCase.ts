import { IAddress } from '../../domain/doctor/Doctor'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetDoctorProfileRequest {
  id: string
}

interface GetDoctorProfileResponse {
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

export class GetDoctorProfileUseCase {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  public async execute(
    request: GetDoctorProfileRequest
  ): Promise<GetDoctorProfileResponse> {
    const { id } = request

    const existingDoctorProfile = await this.doctorRepository.findById(id)

    if (existingDoctorProfile == null) {
      throw new NotFoundError(
        'The current doctor whose profile does not exist.'
      )
    }
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
