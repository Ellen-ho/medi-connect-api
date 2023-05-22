import { IBaseRepository } from '../../../shared/IBaseRepository'
import { User } from '../../User'

export interface IUserRepository extends IBaseRepository<User> {
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  createUser: (name: string, email: string, password: string) => Promise<User>
}
