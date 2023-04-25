import { Request, Response } from 'express'

import { EditWeightRecordUseCase } from '../../../application/record/EditWeightRecordUseCase'
import { CreateWeightRecordUseCase } from '../../../application/record/CreateWeightRecordUseCase'
export interface IRecordController {
  createWeightRecord: (req: Request, res: Response) => Promise<Response>
  editWeightRecord: (req: Request, res: Response) => Promise<Response>
}

export class RecordController implements IRecordController {
  constructor(
    private readonly createWeightRecordUseCase: CreateWeightRecordUseCase,
    private readonly editWeightRecordUseCase: EditWeightRecordUseCase
  ) {}

  public createWeightRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const user = await this.createWeightRecordUseCase.execute(request)

      return res.status(200).json(user)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editWeightRecord = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        weightRecordId: req.params.id,
      }
      const user = await this.editWeightRecordUseCase.execute(request)

      return res.status(200).json(user)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: 'edit weight record error' })
    }
  }
}
