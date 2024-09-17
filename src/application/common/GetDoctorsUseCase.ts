import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'

interface GetDoctorsResponse {
  doctorData: Array<{
    id: string
    avatar: string | null
    firstName: string
    lastName: string
    specialties: MedicalSpecialtyType[]
  }>
}

export class GetDoctorsUseCase {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  public async execute(): Promise<GetDoctorsResponse> {
    const existingDoctors = await this.doctorRepository.findLatestDoctors(10)

    return { doctorData: existingDoctors.data }
  }
}
