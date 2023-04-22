import { User } from '../../../domain/user/User'
import { UserEntity } from './UserEntity'

export class UserMapper {
  public static toDomainModel(entity: UserEntity): User {
    const user = new User({
      id: entity.id,
      email: entity.email,
      displayName: entity.displayName,
      hashedPassword: entity.password,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
    return user
  }

  public static toPersistence(domainModel: User): UserEntity {
    const userEntity = new UserEntity()
    userEntity.id = domainModel.id
    userEntity.email = domainModel.email
    userEntity.displayName = domainModel.displayName
    userEntity.password = domainModel.hashedPassword
    userEntity.createdAt = domainModel.createdAt
    userEntity.updatedAt = domainModel.updatedAt

    return userEntity
  }
}
