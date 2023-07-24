import { GenderType } from '../../domain/doctor/Doctor'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetDoctorListRequest {
  page?: number
  limit?: number
  specialty?: MedicalSpecialtyType
}

interface GetDoctorListResponse {
  data: Array<{
    id: string
    avatar: string | null
    firstName: string
    lastName: string
    specialties: MedicalSpecialtyType[]
    gender: GenderType
  }>
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
    const { specialty } = request
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingDoctors =
      await this.doctorRepository.findAndCountBySpecialties(
        limit,
        offset,
        specialty
      )

    return {
      data: existingDoctors.data,
      pagination: getPagination(limit, page, existingDoctors.counts),
      totalCounts: existingDoctors.counts,
    }
  }
}
