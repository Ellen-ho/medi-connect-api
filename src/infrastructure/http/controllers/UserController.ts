import { Request, Response } from 'express'
import { CreateUser } from '../../../application/user/CreateUser'
import { GetUser } from '../../../application/user/GetUser'
import { User } from '../../../domain/user/User'
import jwt from 'jsonwebtoken'

export interface IUserController {
  login: (req: Request, res: Response) => Promise<Response>
  getUserById: (req: Request, res: Response) => Promise<Response>
  registerNewUser: (req: Request, res: Response) => Promise<Response>
}

export class UserController implements IUserController {
  constructor(
    private readonly getUser: GetUser,
    private readonly createUser: CreateUser
  ) {}

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id, email, createdAt, displayName } = req.user as User

      const token = jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
      })
      return res.json({
        token,
        user: { id, createdAt, displayName },
      })
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: error })
    }
  }

  public getUserById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.user as User
      const user = await this.getUser.execute({ id })

      return res.status(200).json(user)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: 'create user error' })
    }
  }

  public registerNewUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { displayName, email, password, role } = req.body

      const newUser = await this.createUser.execute({
        displayName,
        email,
        password,
        role,
      })

      return res.status(201).json(newUser)
    } catch (error) {
      return res.status(400).json({ message: 'create user error' })
    }
  }
}
