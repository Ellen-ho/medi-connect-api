import { User } from '../../../../domain/user/models/User'
import { IUserRepository } from '../../../../domain/user/interfaces/repositories/IUserRepository'

export class UserRepository implements IUserRepository {
  private readonly users: User[] = []

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id)
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email)
  }

  async save(user: User): Promise<void> {
    this.users.push(user)
  }
}
