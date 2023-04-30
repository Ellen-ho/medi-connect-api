import { IBaseRepository } from '../../../shared/IBaseRepository'
import { Patient } from '../../Patient'

export interface IPatientRepository extends IBaseRepository<Patient> {
  findById: (id: string) => Promise<Patient | null>
  findByUserId: (userId: string) => Promise<Patient | null>
}
