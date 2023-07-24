import { MedicalSpecialtyType } from '../../../question/PatientQuestion'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { Doctor, GenderType } from '../../Doctor'

export interface IDoctorRepository extends IBaseRepository<Doctor> {
  findByDoctorId: (doctorId: string) => Promise<Doctor | null>
  findByUserId: (userId: string) => Promise<Doctor | null>
  findById: (id: string) => Promise<Doctor | null>
  findAndCountBySpecialties: (
    limit: number,
    offset: number,
    specialty?: MedicalSpecialtyType
  ) => Promise<{
    data: Array<{
      id: string
      avatar: string | null
      firstName: string
      lastName: string
      specialties: MedicalSpecialtyType[]
      gender: GenderType
    }>
    counts: number
  }>
}
