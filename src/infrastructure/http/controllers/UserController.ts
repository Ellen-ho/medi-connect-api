import { Request, Response } from 'express'
import { CreateUser } from '../../../application/user/CreateUser'
import { GetUser } from '../../../application/user/GetUser'

export interface IUserController {
  getUserById: (req: Request, res: Response) => Promise<Response>
  registerNewUser: (req: Request, res: Response) => Promise<Response>
}

export class UserController implements IUserController {
  constructor(
    private readonly getUser: GetUser,
    private readonly createUser: CreateUser
  ) {}

  public getUserById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const id = req.params.id
      const user = await this.getUser.execute({ id })

      return res.status(200).json(user)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: error })
    }
  }

  public registerNewUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { name, email, password } = req.body

      const newUser = await this.createUser.execute({ name, email, password })

      return res.status(201).json(newUser)
    } catch (error) {
      return res.status(400).json({ message: 'create user error' })
    }
  }
}
