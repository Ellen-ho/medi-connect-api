import { User } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { IHashGenerator } from '../../domain/utils/IHashGenerator'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface EditUserAccountRequest {
  user: User
  displayName: string
  email: string
  password: string
}

interface EditUserAccountResponse {
  id: string
  displayName: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export class EditUserAccountUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashGenerator: IHashGenerator
  ) {}

  public async execute(
    request: EditUserAccountRequest
  ): Promise<EditUserAccountResponse> {
    const { user, displayName, email, password } = request

    const existingDisplayName = await this.userRepository.findByDisplayName(
      displayName
    )
    if (existingDisplayName !== null && existingDisplayName.id !== user.id) {
      throw new AuthorizationError('This display name is already taken.')
    }

    const existingEmail = await this.userRepository.findByEmail(email)
    if (existingEmail !== null && existingEmail.id !== user.id) {
      throw new AuthorizationError('This email is already taken.')
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const existingAccountData = await this.userRepository.findById(user.id)
    if (existingAccountData == null) {
      throw new NotFoundError('This account does not exist.')
    }

    existingAccountData.updateData({
      displayName,
      email,
      password: hashedPassword,
    })

    await this.userRepository.save(existingAccountData)

    return {
      id: existingAccountData.id,
      displayName: existingAccountData.displayName,
      email: existingAccountData.email,
      createdAt: existingAccountData.createdAt,
      updatedAt: existingAccountData.updatedAt,
    }
  }
}
