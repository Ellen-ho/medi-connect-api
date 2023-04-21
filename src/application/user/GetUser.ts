import { User } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'

interface GetUserRequestDTO {
  id: string
}

interface GetUserResponseDTO extends User {}

export class GetUser {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(
    request: GetUserRequestDTO
  ): Promise<GetUserResponseDTO> {
    const { id } = request

    const existingUser = await this.userRepository.findById(id)

    if (existingUser == null) {
      throw new Error('User not found')
    }

    return existingUser
  }
}
