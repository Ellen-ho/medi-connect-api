import { User } from '../../domain/user/models/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { IUuidService } from '../../domain/user/interfaces/services/IUuidService'

interface CreateUserRequestDTO {
  name: string
  email: string
  password: string
}

interface CreateUserResponseDTO {
  id: string
  name: string
  email: string
}

export class CreateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly uuidService: IUuidService
  ) {}

  async execute(request: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    const { name, email, password } = request

    const userExists = await this.userRepository.findByEmail(email)

    if (userExists != null) {
      throw new Error('User already exists with this email.')
    }

    const user = new User({
      id: this.uuidService.generateUuid(),
      name,
      email,
      password,
    })

    await this.userRepository.save(user)

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }
}
