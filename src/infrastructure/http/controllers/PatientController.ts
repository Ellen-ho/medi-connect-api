import { Request, Response } from 'express'
import { CreatePatientProfileUseCase } from '../../../application/patient/CreatePatientProfileUseCase'
import { EditPatientProfileUseCase } from '../../../application/patient/EditPatientProfileUseCase'
export interface IPatientController {
  createPatientProfile: (req: Request, res: Response) => Promise<Response>
  editPatientProfile: (req: Request, res: Response) => Promise<Response>
}

export class PatientController implements IPatientController {
  constructor(
    private readonly createPatientProfileUseCase: CreatePatientProfileUseCase,
    private readonly editPatientProfileUseCase: EditPatientProfileUseCase
  ) {}

  public createPatientProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const user = await this.createPatientProfileUseCase.execute(request)

      return res.status(200).json(user)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editPatientProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const user = await this.editPatientProfileUseCase.execute(request)

      return res.status(200).json(user)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: 'edit patient error' })
    }
  }
}
