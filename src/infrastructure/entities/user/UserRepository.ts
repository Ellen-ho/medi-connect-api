import { DataSource } from 'typeorm'
import { IUserRepository } from '../../../domain/user/interfaces/repositories/IUserRepository'
import { User } from '../../../domain/user/User'
import { BaseRepository } from '../BaseRepository'
import { UserMapper } from './UserMapper'
import { UserEntity } from './UserEntity'

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
      throw new Error('repository findById error')
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { email },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findByEmail error')
    }
  }
}
