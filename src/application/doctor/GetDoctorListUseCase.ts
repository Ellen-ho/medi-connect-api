import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetDoctorListRequest {
  page?: number
  limit?: number
  specialties?: MedicalSpecialtyType
}

export interface IGetDoctorItem {
  id: string
  avatar: string | null
  firstName: string
  lastName: string
  specialties: MedicalSpecialtyType[]
}

interface GetDoctorListResponse {
  data: IGetDoctorItem[]
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
  totalCounts: number
}

export class GetDoctorListUseCase {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  public async execute(
    request: GetDoctorListRequest
  ): Promise<GetDoctorListResponse> {
    const { specialties } = request
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingDoctors =
      await this.doctorRepository.findAndCountBySpecialties(
        limit,
        offset,
        specialties
      )

    const data: IGetDoctorItem[] = existingDoctors.data.map((doctor) => ({
      id: doctor.id,
      avatar: doctor.avatar,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialties: doctor.specialties,
    }))

    return {
      data,
      pagination: getPagination(limit, page),
      totalCounts: existingDoctors.count,
    }
  }
}
