import { Request, Response } from 'express'
import { CreateDoctorProfileUseCase } from '../../../application/doctor/CreateDoctorProfileUseCase'
import { EditDoctorProfileUseCase } from '../../../application/doctor/EditDoctorProfileUseCase'
import { GetDoctorStatisticUseCase } from '../../../application/doctor/GetDoctorStatisticUseCase'
import { User } from '../../../domain/user/User'

export interface IDoctorController {
  createDoctorProfile: (req: Request, res: Response) => Promise<Response>
  editDoctorProfile: (req: Request, res: Response) => Promise<Response>
  getDoctorStatistic: (req: Request, res: Response) => Promise<Response>
}

export class DoctorController implements IDoctorController {
  constructor(
    private readonly createDoctorProfileUseCase: CreateDoctorProfileUseCase,
    private readonly editDoctorProfileUseCase: EditDoctorProfileUseCase,
    private readonly getDoctorStatisticUseCase: GetDoctorStatisticUseCase
  ) {}

  public createDoctorProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { ...req.body, user: req.user }
    const user = await this.createDoctorProfileUseCase.execute(request)

    return res.status(200).json(user)
  }

  public editDoctorProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { ...req.body, user: req.user }
    const user = await this.editDoctorProfileUseCase.execute(request)
    return res.status(200).json(user)
  }

  public getDoctorStatistic = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
      doctorId: req.params.id,
    }
    const result = await this.getDoctorStatisticUseCase.execute(request)
    return res.status(200).json(result)
  }
}
