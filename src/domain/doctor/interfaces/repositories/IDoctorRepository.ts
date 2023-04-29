import { IBaseRepository } from '../../../shared/IBaseRepository'
import { Doctor } from '../Doctor'

export interface IDoctorRepository extends IBaseRepository<Doctor> {
  findById: (id: string) => Promise<Doctor | null>
  findByUserId: (userId: string) => Promise<Doctor | null>
}
