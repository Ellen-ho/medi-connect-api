import { User } from '../../../domain/user/User'
import { UserEntity } from './SleepRecordEntity'

export class UserMapper {
  public static toDomainModel(entity: UserEntity): User {
    const user = new User({
      id: entity.id,
      email: entity.email,
      name: entity.name,
      hashedPassword: entity.password,
    })
    return user
  }

  public static toPersistence(domainModel: User): UserEntity {
    const userEntity = new UserEntity()
    userEntity.id = domainModel.id
    userEntity.email = domainModel.email
    userEntity.name = domainModel.name
    userEntity.password = domainModel.hashedPassword

    return userEntity
  }
}
