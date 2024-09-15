import { Request, Response } from 'express'
import { CreatePatientProfileUseCase } from '../../../application/patient/CreatePatientProfileUseCase'
import { EditPatientProfileUseCase } from '../../../application/patient/EditPatientProfileUseCase'
import { GetPatientProfileUseCase } from '../../../application/patient/GetPatientProfileUseCase'
import { User } from '../../../domain/user/User'

export interface IPatientController {
  createPatientProfile: (req: Request, res: Response) => Promise<Response>
  editPatientProfile: (req: Request, res: Response) => Promise<Response>
  getPatientProfile: (req: Request, res: Response) => Promise<Response>
}

export class PatientController implements IPatientController {
  constructor(
    private readonly createPatientProfileUseCase: CreatePatientProfileUseCase,
    private readonly editPatientProfileUseCase: EditPatientProfileUseCase,
    private readonly getPatientProfileUseCase: GetPatientProfileUseCase
  ) {}

  public createPatientProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { ...req.body, user: req.user }
    const user = await this.createPatientProfileUseCase.execute(request)
    return res.status(200).json(user)
  }

  public editPatientProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { ...req.body, user: req.user }
    const user = await this.editPatientProfileUseCase.execute(request)
    return res.status(200).json(user)
  }

  public getPatientProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
      targetPatientId: req.query.targetPatientId as string,
    }
    const result = await this.getPatientProfileUseCase.execute(request)
    return res.status(200).json(result)
  }
}
