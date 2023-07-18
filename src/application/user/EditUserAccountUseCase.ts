import { User } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { IHashGenerator } from '../../domain/utils/IHashGenerator'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface EditUserAccountRequest {
  user: User
  displayName?: string
  password?: string
}

interface EditUserAccountResponse {
  id: string
  displayName: string
}

export class EditUserAccountUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashGenerator: IHashGenerator
  ) {}

  public async execute(
    request: EditUserAccountRequest
  ): Promise<EditUserAccountResponse> {
    const { user, displayName, password } = request

    const existingAccountData = await this.userRepository.findById(user.id)

    if (existingAccountData == null) {
      throw new NotFoundError('This account does not exist.')
    }
    const newDisplayName =
      displayName === undefined ? existingAccountData.displayName : displayName

    let newPassword
    if (password === undefined) {
      newPassword = existingAccountData.hashedPassword
    } else {
      newPassword = await this.hashGenerator.hash(password)
    }
    const existingDisplayName = await this.userRepository.findByDisplayName(
      newDisplayName
    )
    if (existingDisplayName !== null && existingDisplayName.id !== user.id) {
      throw new AuthorizationError('This display name is already taken.')
    }

    existingAccountData.updateData({
      displayName: newDisplayName,
      password: newPassword,
    })

    await this.userRepository.save(existingAccountData)

    return {
      id: existingAccountData.id,
      displayName: existingAccountData.displayName,
    }
  }
}
