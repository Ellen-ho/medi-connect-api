import { Request, Response } from 'express'
import { CreatePatientProfileUseCase } from '../../../application/patient/CreatePatientProfileUseCase'
import { EditPatientProfileUseCase } from '../../../application/patient/EditPatientProfileUseCase'
import { User } from '../../../domain/user/User'
export interface IPatientController {
  editPatientProfile: (req: Request, res: Response) => Promise<Response>
  createPatientProfile: (req: Request, res: Response) => Promise<Response>
}

export class PatientController implements IPatientController {
  constructor(
    private readonly editPatientProfileUseCase: EditPatientProfileUseCase,
    private readonly createPatientProfileUseCase: CreatePatientProfileUseCase
  ) {}

  public createPatientProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.user as User
      const user = await this.editPatientProfileUseCase.execute({ id })

      return res.status(200).json(user)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: 'create user error' })
    }
  }

  public editPatientProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.user as User
      const user = await this.editPatientProfileUseCase.execute({ id })

      return res.status(200).json(user)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: 'create user error' })
    }
  }
}
