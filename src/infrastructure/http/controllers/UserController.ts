import { Request, Response } from 'express'
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase'
import { GetUserAccountUseCase } from '../../../application/user/GetUserAccountUseCase'
import { User, UserRoleType } from '../../../domain/user/User'
import jwt from 'jsonwebtoken'
import { PatientRepository } from '../../entities/patient/PatientRepository'
import { DoctorRepository } from '../../entities/doctor/DoctorRepository'
import { EditUserAccountUseCase } from '../../../application/user/EditUserAccountUseCase'
import { imgurFileHandler } from '../../helpers/FileHandler'

interface MulterRequest extends Request {
  files: any
}

export interface IUserController {
  login: (req: Request, res: Response) => Promise<Response>
  getUserAccount: (req: Request, res: Response) => Promise<Response>
  registerNewUser: (req: Request, res: Response) => Promise<Response>
  editUserAccount: (req: Request, res: Response) => Promise<Response>
  uploadAvatar: (req: Request, res: Response) => Promise<Response>
}

export class UserController implements IUserController {
  constructor(
    private readonly getUserAccountUseCase: GetUserAccountUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly editUserAccountUseCase: EditUserAccountUseCase
  ) {}

  public login = async (req: Request, res: Response): Promise<Response> => {
    const { id, email, createdAt, displayName, role } = req.user as User

    const token = jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
      expiresIn: '30d',
    })

    let loginPatient
    let loginDoctor
    let avatar
    if (role === UserRoleType.PATIENT) {
      loginPatient = await this.patientRepository.findByUserId(id)
      avatar = loginPatient?.avatar
    }

    if (role === UserRoleType.DOCTOR) {
      loginDoctor = await this.doctorRepository.findByUserId(id)
      avatar = loginDoctor?.avatar
    }

    return res.status(200).json({
      token,
      user: { id, createdAt, displayName, role, avatar },
      patientId: loginPatient?.id,
      doctorId: loginDoctor?.id,
    })
  }

  public getUserAccount = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { user: req.user as User }
    const user = await this.getUserAccountUseCase.execute(request)

    return res.status(200).json(user)
  }

  public registerNewUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { displayName, email, password, role } = req.body

    const newUser = await this.createUserUseCase.execute({
      displayName,
      email,
      password,
      role,
    })

    return res.status(201).json(newUser)
  }

  public editUserAccount = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      ...req.body,
      user: req.user as User,
    }
    const user = await this.editUserAccountUseCase.execute(request)
    return res.status(200).json(user)
  }

  public uploadAvatar = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const [avatar] = (req as MulterRequest).files.avatar
    const imageUrl = await imgurFileHandler(avatar)

    return res.status(200).json({ imageUrl })
  }
}
