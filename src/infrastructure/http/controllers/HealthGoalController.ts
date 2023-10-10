import { Request, Response } from 'express'
import { CreateHealthGoalUseCase } from '../../../application/goal/CreateHealthGoalUseCase'
import { User } from '../../../domain/user/User'
import { ActivateHealthGoalUseCase } from '../../../application/goal/ActivateHealthGoalUseCase'
import { RejectHealthGoalUseCase } from '../../../application/goal/RejectHealthGoalUseCase'
import { GetHealthGoalUseCase } from '../../../application/goal/GetHealthGoalUseCase'
import { GetHealthGoalListUseCase } from '../../../application/goal/GetHealthGoalListUseCase'
import { CancelHealthGoalUseCase } from '../../../application/goal/CancelHealthGoalUseCase'
import { UpdateGoalResultUseCase } from 'application/goal/UpdateGoalResultUseCase'

export interface IHealthGoalController {
  createHealthGoal: (req: Request, res: Response) => Promise<Response>
  activateHealthGoal: (req: Request, res: Response) => Promise<Response>
  rejectHealthGoal: (req: Request, res: Response) => Promise<Response>
  getHealthGoal: (req: Request, res: Response) => Promise<Response>
  getHealthGoalList: (req: Request, res: Response) => Promise<Response>
  updateGoalResult: (req: Request, res: Response) => Promise<Response>
}

export class HealthGoalController implements IHealthGoalController {
  constructor(
    private readonly createHealthGoalUseCase: CreateHealthGoalUseCase,
    private readonly cancelHealthGoalUseCase: CancelHealthGoalUseCase,
    private readonly activateHealthGoalUseCase: ActivateHealthGoalUseCase,
    private readonly rejectHealthGoalUseCase: RejectHealthGoalUseCase,
    private readonly getHealthGoalUseCase: GetHealthGoalUseCase,
    private readonly getHealthGoalListUseCase: GetHealthGoalListUseCase,
    private readonly updateGoalResultUseCase: UpdateGoalResultUseCase
  ) {}

  public createHealthGoal = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
    }
    const result = await this.createHealthGoalUseCase.execute(request)
    return res.status(200).json(result)
  }

  public updateGoalResult = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      healthGoalId: req.params.id,
    }
    const result = await this.updateGoalResultUseCase.execute(request)
    return res.status(200).json(result)
  }

  public canceleHealthGoal = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
    }
    const result = await this.cancelHealthGoalUseCase.execute(request)
    return res.status(200).json(result)
  }

  public activateHealthGoal = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
      healthGoalId: req.params.id,
    }
    const result = await this.activateHealthGoalUseCase.execute(request)
    return res.status(200).json(result)
  }

  public rejectHealthGoal = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
      healthGoalId: req.params.id,
    }
    const result = await this.rejectHealthGoalUseCase.execute(request)
    return res.status(200).json(result)
  }

  public getHealthGoal = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
      healthGoalId: req.params.id,
      targetPatientId: req.query.targetPatientId as string,
    }
    const result = await this.getHealthGoalUseCase.execute(request)
    return res.status(200).json(result)
  }

  public getHealthGoalList = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
      targetPatientId: req.query.targetPatientId as string,
      limit: Number(req.query.limit),
      page: Number(req.query.page),
    }
    const result = await this.getHealthGoalListUseCase.execute(request)
    return res.status(200).json(result)
  }
}
