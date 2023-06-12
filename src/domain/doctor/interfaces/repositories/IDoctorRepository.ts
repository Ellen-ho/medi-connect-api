import { IBaseRepository } from '../../../shared/IBaseRepository'
import { Doctor } from '../../Doctor'

export interface IDoctorRepository extends IBaseRepository<Doctor> {
  findByDoctorId: (doctorId: string) => Promise<Doctor | null>
  findByUserId: (userId: string) => Promise<Doctor | null>
  findById: (id: string) => Promise<Doctor | null>
}
