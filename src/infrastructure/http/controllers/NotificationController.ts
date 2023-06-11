import { Request, Response } from 'express'
import { GetNotificationListsUseCase } from '../../../application/notification/GetNotificationListUseCase'
import { GetNotificationDetailsUseCase } from '../../../application/notification/GetNotificationDetailsUseCase'
import { User } from '../../../domain/user/User'
import { GetNotificationHintsUseCase } from '../../../application/notification/GetNotificationHintsUseCase'
import { ReadAllNotificationsUseCase } from '../../../application/notification/ReadAllNotificationsUseCase'
import { DeleteAllNotificationsUseCase } from '../../../application/notification/DeleteAllNotificationsUseCase'
import { DeleteNotificationUseCase } from '../../../application/notification/DeleteNotificationUseCase'

export interface INotificationController {
  getNotificationLists: (req: Request, res: Response) => Promise<Response>
  getNotificationDetails: (req: Request, res: Response) => Promise<Response>
  getNotificationHints: (req: Request, res: Response) => Promise<Response>
  readAllNotifications: (req: Request, res: Response) => Promise<Response>
  deleteAllNotifications: (req: Request, res: Response) => Promise<Response>
  deleteNotification: (req: Request, res: Response) => Promise<Response>
}

export class NotificationController implements INotificationController {
  constructor(
    private readonly getNotificationListsUseCase: GetNotificationListsUseCase,
    private readonly getNotificationDetailsUseCase: GetNotificationDetailsUseCase,
    private readonly getNotificationHintsUseCase: GetNotificationHintsUseCase,
    private readonly readAllNotificationsUseCase: ReadAllNotificationsUseCase,
    private readonly deleteAllNotificationsUseCase: DeleteAllNotificationsUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase
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
        notificationId: req.params.id,
      }
      const result = await this.getNotificationDetailsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public getNotificationHints = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
      }
      const result = await this.getNotificationHintsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public readAllNotifications = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
      }
      const result = await this.readAllNotificationsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public deleteAllNotifications = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
      }
      const result = await this.deleteAllNotificationsUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public deleteNotification = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        notificationId: req.params.id,
      }
      const result = await this.deleteNotificationUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }
}
