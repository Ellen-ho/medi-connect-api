import { User } from '../../models/User'

export interface IUserRepository {
  findById: (id: string) => Promise<User | undefined>
  findByEmail: (email: string) => Promise<User | undefined>
  save: (user: User) => Promise<void>
}
