import { DataSource } from 'typeorm'
import { IUserRepository } from '../../../domain/user/interfaces/repositories/IUserRepository'
import { User } from '../../../domain/user/User'
import { BaseRepository } from '../../database/BaseRepository'
import { UserMapper } from './UserMapper'
import { UserEntity } from './UserEntity'
import { RepositoryError } from '../../error/RepositoryError'

export class UserRepository
  extends BaseRepository<UserEntity, User>
  implements IUserRepository
{
  constructor(dataSource: DataSource) {
    super(UserEntity, new UserMapper(), dataSource)
  }

  public async findById(id: string): Promise<User | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError('UserRepository findById error', e as Error)
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { email },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError('UserRepository findByEmail error', e as Error)
    }
  }
}
