import { IUuidService } from '../../domain/utils/IUuidService'
import { User } from '../../domain/user/User'
import { Doctor, GenderType, IAddress } from '../../domain/doctor/Doctor'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { ValidationError } from '../../infrastructure/error/ValidationError'
import { localFileHandler } from '../../infrastructure/http/middlewares/FileHandler'

interface CreateDoctorProfileRequest {
  user: User
  file: Express.Multer.File | null
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
      file,
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

    let avatarFilePath: string | null = null
    if (file !== null) {
      const filePath = await localFileHandler(file)
      avatarFilePath = filePath !== null ? filePath : null
    }

    const doctor = new Doctor({
      id: this.uuidService.generateUuid(),
      avatar: avatarFilePath,
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
