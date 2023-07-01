import { User } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

export interface GetUserRequest {
  id: string
}

interface GetUserResponse extends Omit<User, 'hashedPassword'> {}

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(request: GetUserRequest): Promise<GetUserResponse> {
    const { id } = request

    const existingUser = await this.userRepository.findById(id)

    if (existingUser == null) {
      throw new NotFoundError('User not found')
    }

    return {
      id: existingUser.id,
      email: existingUser.email,
      displayName: existingUser.displayName,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    }
  }
}
