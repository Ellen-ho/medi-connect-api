import { IBaseRepository } from '../../../shared/IBaseRepository'
import { User, UserRoleType } from '../../User'

export interface IUserRepository extends IBaseRepository<User> {
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  findAllByRole: (role: UserRoleType) => Promise<User[]>
  findByDisplayName: (displayName: string) => Promise<User | null>
}
