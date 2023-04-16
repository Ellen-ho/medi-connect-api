import { Request, Response } from 'express'
import { CreateUser } from '../../../application/user/CreateUser'
import { GetUser } from '../../../application/user/GetUser'
import { UserRepository } from '../../adapters/User/repositories/UserRepository'
import { UuidService } from '../../utils/uuid'

const userRepository = new UserRepository()
const uuidService = new UuidService()
const getUser = new GetUser(userRepository)
const createUser = new CreateUser(userRepository, uuidService)

export interface IUserController {
  getUser: (req: Request, res: Response) => Promise<Response>
  createUser: (req: Request, res: Response) => Promise<Response>
}

export class UserController implements IUserController {
  async getUser(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id

      const user = await getUser.execute({ id })

      return res.status(200).json(user)
    } catch (error) {
      return res.status(400).json({ message: 'get user error' })
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body

      const newUser = await createUser.execute({ name, email, password })

      return res.status(201).json(newUser)
    } catch (error) {
      return res.status(400).json({ message: 'create user error' })
    }
  }
}
