import { Request, Response } from 'express'
import { GetNotificationListsUseCase } from '../../../application/notification/GetNotificationListUseCase'
import { GetNotificationDetailsUseCase } from '../../../application/notification/GetNotificationDetailsUseCase'
import { User } from '../../../domain/user/User'

export interface INotificationController {
  getNotificationLists: (req: Request, res: Response) => Promise<Response>
  getNotificationDetails: (req: Request, res: Response) => Promise<Response>
}

export class NotificationController implements INotificationController {
  constructor(
    private readonly getNotificationListsUseCase: GetNotificationListsUseCase,
    private readonly getNotificationDetailsUseCase: GetNotificationDetailsUseCase
  ) {}

  public getNotificationLists = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
      }
      const result = await this.getNotificationListsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getNotificationDetails = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
      }
      const result = await this.getNotificationListsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }
}
