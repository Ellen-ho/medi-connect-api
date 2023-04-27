import { Request, Response } from 'express'
import { CreateDoctorProfileUseCase } from '../../../application/doctor/CreateDoctorProfileUseCase'
import { EditDoctorProfileUseCase } from '../../../application/doctor/EditDoctorProfileUseCase'

export interface IDoctorController {
  createDoctorProfile: (req: Request, res: Response) => Promise<Response>
  editDoctorProfile: (req: Request, res: Response) => Promise<Response>
}

export class DoctorController implements IDoctorController {
  constructor(
    private readonly createDoctorProfileUseCase: CreateDoctorProfileUseCase,
    private readonly editDoctorProfileUseCase: EditDoctorProfileUseCase
  ) {}

  public createDoctorProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const user = await this.createDoctorProfileUseCase.execute(request)

      return res.status(200).json(user)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editDoctorProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const user = await this.editDoctorProfileUseCase.execute(request)

      return res.status(200).json(user)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: 'edit doctor error' })
    }
  }
}
