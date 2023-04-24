import { Patient } from '../../Patient'

export interface IPatientRepository {
  findById: (id: string) => Promise<Patient | null>
  findByUserId: (userId: string) => Promise<Patient | null>
  save: (user: Patient) => Promise<void>
}
