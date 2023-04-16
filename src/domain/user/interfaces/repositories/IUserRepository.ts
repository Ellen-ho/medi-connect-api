import { UserEntity } from '../../../../infrastructure/adapters/User/entities/User'
import { User } from '../../models/User'

export interface IUserRepository {
  findById: (id: string) => Promise<UserEntity | null>
  findByEmail: (email: string) => Promise<UserEntity | null>
  save: (user: User) => Promise<void>
}
