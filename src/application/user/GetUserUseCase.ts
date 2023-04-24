import { User } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'

interface GetUserRequest {
  id: string
}

interface GetUserResponse extends User {}

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(request: GetUserRequest): Promise<GetUserResponse> {
    const { id } = request

    const existingUser = await this.userRepository.findById(id)

    if (existingUser == null) {
      throw new Error('User not found')
    }

    return existingUser
  }
}
