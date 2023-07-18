import { DataSource } from 'typeorm'
import { IUserRepository } from '../../../domain/user/interfaces/repositories/IUserRepository'
import { User, UserRoleType } from '../../../domain/user/User'
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

  public async findAllByRole(role: UserRoleType): Promise<User[]> {
    try {
      const entities = await this.getRepo().find({
        where: { role },
        relations: ['patient'],
      })
      return entities.length !== 0
        ? entities.map((entity) => this.getMapper().toDomainModel(entity))
        : []
    } catch (e) {
      throw new RepositoryError(
        'UserRepository findAllByRole error',
        e as Error
      )
    }
  }

  public async findByDisplayName(displayName: string): Promise<User | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { displayName },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'UserRepository findByDisplayName error',
        e as Error
      )
    }
  }
}
