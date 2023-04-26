import { Doctor } from '../Doctor'

export interface IDoctorRepository {
  findById: (id: string) => Promise<Doctor | null>
  findByUserId: (userId: string) => Promise<Doctor | null>
  save: (user: Doctor) => Promise<void>
}
