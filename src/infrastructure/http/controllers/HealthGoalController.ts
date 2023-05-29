import { Request, Response } from 'express'
import { CreateHealthGoalUseCase } from '../../../application/goal/CreateHealthGoalUseCase'
import { User } from '../../../domain/user/User'
import { ActivateHealthGoalUseCase } from '../../../application/goal/ActivateHealthGoalUseCase'
import { RejectHealthGoalUseCase } from '../../../application/goal/RejectHealthGoalUseCase'
import { GetHealthGoalUseCase } from '../../../application/goal/GetHealthGoalUseCase'

export interface IHealthGoalController {
  createHealthGoal: (req: Request, res: Response) => Promise<Response>
  activateHealthGoal: (req: Request, res: Response) => Promise<Response>
  rejectHealthGoal: (req: Request, res: Response) => Promise<Response>
  getHealthGoal: (req: Request, res: Response) => Promise<Response>
}

export class HealthGoalController implements IHealthGoalController {
  constructor(
    private readonly createHealthGoalUseCase: CreateHealthGoalUseCase,
    private readonly activateHealthGoalUseCase: ActivateHealthGoalUseCase,
    private readonly rejectHealthGoalUseCase: RejectHealthGoalUseCase,
    private readonly getHealthGoalUseCase: GetHealthGoalUseCase
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

  public activateHealthGoal = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        healthGoalId: req.params.id,
      }
      const result = await this.activateHealthGoalUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public rejectHealthGoal = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        healthGoalId: req.params.id,
      }
      const result = await this.rejectHealthGoalUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getHealthGoal = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        healthGoalId: req.params.id,
      }
      const result = await this.getHealthGoalUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }
}
