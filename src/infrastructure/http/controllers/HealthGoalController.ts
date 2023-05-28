import { Request, Response } from 'express'
import { CreateHealthGoalUseCase } from '../../../application/goal/CreateHealthGoalUseCase'
import { User } from '../../../domain/user/User'

export interface IHealthGoalController {
  createHealthGoal: (req: Request, res: Response) => Promise<Response>
}

export class HealthGoalController implements IHealthGoalController {
  constructor(
    private readonly createHealthGoalUseCase: CreateHealthGoalUseCase
  ) {}

  public createHealthGoal = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
      }
      const result = await this.createHealthGoalUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }
}
