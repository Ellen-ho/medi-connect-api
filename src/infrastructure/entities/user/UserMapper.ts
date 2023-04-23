import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { User } from '../../../domain/user/User'
import { UserEntity } from './UserEntity'

export class UserMapper implements IEntityMapper<UserEntity, User> {
  public toDomainModel(entity: UserEntity): User {
    const user = new User({
      id: entity.id,
      email: entity.email,
      displayName: entity.displayName,
      hashedPassword: entity.password,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
    return user
  }

  public toPersistence(domainModel: User): UserEntity {
    const userEntity = new UserEntity()
    userEntity.id = domainModel.id
    userEntity.email = domainModel.email
    userEntity.displayName = domainModel.displayName
    userEntity.password = domainModel.hashedPassword
    userEntity.role = domainModel.role
    userEntity.createdAt = domainModel.createdAt
    userEntity.updatedAt = domainModel.updatedAt

    return userEntity
  }
}
