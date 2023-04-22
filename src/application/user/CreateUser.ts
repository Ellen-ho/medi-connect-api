import { User } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { IHashGenerator } from '../../domain/utils/IHashGenerator'

interface CreateUserRequestDTO {
  displayName: string
  email: string
  password: string
}

interface CreateUserResponseDTO {
  id: string
  displayName: string
  email: string
}

export class CreateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly uuidService: IUuidService,
    private readonly hashGenerator: IHashGenerator
  ) {}

  public async execute(
    request: CreateUserRequestDTO
  ): Promise<CreateUserResponseDTO> {
    const { displayName, email, password } = request

    const userExists = await this.userRepository.findByEmail(email)

    if (userExists != null) {
      throw new Error('User already exists with this email.')
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    const user = new User({
      id: this.uuidService.generateUuid(),
      displayName,
      email,
      hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.userRepository.save(user)

    return {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
    }
  }
}
