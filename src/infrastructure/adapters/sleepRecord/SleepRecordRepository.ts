import { DataSource, Repository } from 'typeorm'
import { IUserRepository } from '../../../domain/user/interfaces/repositories/IUserRepository'
import { User } from '../../../domain/user/User'
import { BaseRepository } from '../BaseRepository'
import { UserEntity } from './SleepRecordEntity'
import { UserMapper } from './SleepRecordMapper'

export class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  private readonly repo: Repository<UserEntity>
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource)
    this.repo = this.getRepo()
  }

  public async findById(id: string): Promise<User | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? UserMapper.toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { email },
      })
      return entity != null ? UserMapper.toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findByEmail error')
    }
  }

  public async save(user: User): Promise<void> {
    try {
      await this.getRepo().save(user)
    } catch (e) {
      throw new Error('repository findByEmail error')
    }
  }
}
