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

    const userExists = await this.userRepository.findById(id)

    if (userExists == null) {
      throw new Error('User not found')
    }

    return userExists
  }
}
