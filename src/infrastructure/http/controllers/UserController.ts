import { Request, Response } from 'express'
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase'
import { GetUserAccountUseCase } from '../../../application/user/GetUserAccountUseCase'
import { User, UserRoleType } from '../../../domain/user/User'
import jwt from 'jsonwebtoken'
import { PatientRepository } from '../../entities/patient/PatientRepository'
import { DoctorRepository } from '../../entities/doctor/DoctorRepository'
import { EditUserAccountUseCase } from '../../../application/user/EditUserAccountUseCase'
import { CreatePasswordChangeMailUseCase } from 'application/user/CreatePasswordChangeMailUseCase'
import { UpdatePasswordUseCase } from 'application/user/UpdatePasswordUseCase'
import { EditUserAvatarUseCase } from 'application/user/EditUserAvatarUseCase'

interface MulterRequest extends Request {
  files: any
}

export interface IUserController {
  login: (req: Request, res: Response) => Promise<Response>
  getUserAccount: (req: Request, res: Response) => Promise<Response>
  registerNewUser: (req: Request, res: Response) => Promise<Response>
  editUserAccount: (req: Request, res: Response) => Promise<Response>
  editUserAvatar: (req: Request, res: Response) => Promise<Response>
  createPasswordChangeMail: (req: Request, res: Response) => Promise<Response>
  updatePassword: (req: Request, res: Response) => Promise<Response>
}

export class UserController implements IUserController {
  constructor(
    private readonly getUserAccountUseCase: GetUserAccountUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly editUserAccountUseCase: EditUserAccountUseCase,
    private readonly createPasswordChangeMailUseCase: CreatePasswordChangeMailUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    private readonly editUserAvatarUseCase: EditUserAvatarUseCase
  ) {}

  public login = async (req: Request, res: Response): Promise<Response> => {
    const { id, email, createdAt, displayName, role } = req.user as User

    const token = jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
      expiresIn: '30d',
    })

    let loginPatient
    let loginDoctor
    let avatar
    let hasProfile
    if (role === UserRoleType.PATIENT) {
      loginPatient = await this.patientRepository.findByUserId(id)
      avatar = loginPatient?.avatar
      loginPatient !== null ? (hasProfile = true) : (hasProfile = false)
    }

    if (role === UserRoleType.DOCTOR) {
      loginDoctor = await this.doctorRepository.findByUserId(id)
      avatar = loginDoctor?.avatar
      loginDoctor !== null ? (hasProfile = true) : (hasProfile = false)
    }

    return res.status(200).json({
      token,
      user: { id, createdAt, displayName, role, avatar },
      patientId: loginPatient?.id,
      doctorId: loginDoctor?.id,
      hasProfile,
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

  public editUserAvatar = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const [avatar] = (req as MulterRequest).files.avatar

      const response = await this.editUserAvatarUseCase.execute({
        file: avatar,
      })

      return res.status(200).json({
        message: 'Edit avatar successfully',
        imageUrl: response.imageUrl,
      })
    } catch (e) {
      throw new Error('Edit avatar error: ' + (e as Error).message)
    }
  }

  public createPasswordChangeMail = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      ...req.body,
    }
    const result = await this.createPasswordChangeMailUseCase.execute(request)
    return res.status(200).json(result)
  }

  public updatePassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      ...req.body,
    }
    const result = await this.updatePasswordUseCase.execute(request)
    return res.status(200).json(result)
  }
}
