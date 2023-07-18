import { User, UserRoleType } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

export interface GetUserAccountRequest {
  user: User
}

interface GetUserAccountResponse {
  id: string
  displayName: string
  email: string
  role: UserRoleType
  createdAt: Date
  updatedAt: Date
}

export class GetUserAccountUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(
    request: GetUserAccountRequest
  ): Promise<GetUserAccountResponse> {
    const { user } = request

    const existingUser = await this.userRepository.findById(user.id)

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
