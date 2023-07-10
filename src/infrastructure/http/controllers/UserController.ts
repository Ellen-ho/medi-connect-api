import { Request, Response } from 'express'
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase'
import { GetUserUseCase } from '../../../application/user/GetUserUseCase'
import { User, UserRoleType } from '../../../domain/user/User'
import jwt from 'jsonwebtoken'
import { PatientRepository } from '../../entities/patient/PatientRepository'
import { DoctorRepository } from '../../entities/doctor/DoctorRepository'

export interface IUserController {
  login: (req: Request, res: Response) => Promise<Response>
  getUserById: (req: Request, res: Response) => Promise<Response>
  registerNewUser: (req: Request, res: Response) => Promise<Response>
}

export class UserController implements IUserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository
  ) {}

  public login = async (req: Request, res: Response): Promise<Response> => {
    const { id, email, createdAt, displayName, role } = req.user as User

    const token = jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
      expiresIn: '30d',
    })

    let loginPatient
    let loginDoctor
    if (role === UserRoleType.PATIENT) {
      loginPatient = await this.patientRepository.findByUserId(id)
    }

    if (role === UserRoleType.DOCTOR) {
      loginDoctor = await this.doctorRepository.findByUserId(id)
    }

    return res.status(200).json({
      token,
      user: { id, createdAt, displayName, role },
      patintId: loginPatient?.id,
      doctorId: loginDoctor?.id,
    })
  }

  public getUserById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.user as User
    const user = await this.getUserUseCase.execute({ id })

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
}
