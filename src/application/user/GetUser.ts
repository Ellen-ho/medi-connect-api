import { User } from '../../domain/user/models/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'

interface GetUserRequestDTO {
  id: string
}

interface GetUserResponseDTO extends User {}

export class GetUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: GetUserRequestDTO): Promise<GetUserResponseDTO> {
    const { id } = request

    const existingUser = await this.userRepository.findById(id)

    if (existingUser == null) {
      throw new Error('User not found')
    }

    // TODO: need to create a mapper to map the UserEntity to User
    return new User({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      password: existingUser.password,
    })
  }
}
