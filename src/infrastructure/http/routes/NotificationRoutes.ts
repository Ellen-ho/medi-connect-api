import { Router } from 'express'
import { INotificationController } from '../controllers/NotificationController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { validator } from '../middlewares/Validator'
import {
  deleteNotificationSchema,
  getNotificationDetailsSchema,
} from '../../../application/notification/notificationValidator'
import { authenticated } from '../middlewares/Auth'

export class NotificationRoutes {
  private readonly routes: Router
  constructor(
    private readonly NotificationController: INotificationController
  ) {
    this.routes = Router()
    this.routes.get(
      '/hints',
      authenticated,
      asyncHandler(this.NotificationController.getNotificationHints)
    )
    this.routes.get(
      '/:id',
      authenticated,
      validator(getNotificationDetailsSchema),
      asyncHandler(this.NotificationController.getNotificationDetails)
    )
    this.routes.get(
      '/',
      authenticated,
      asyncHandler(this.NotificationController.getNotificationList)
    )
    this.routes.patch(
      '/read-all',
      authenticated,
      asyncHandler(this.NotificationController.readAllNotifications)
    )
    this.routes.delete(
      '/all',
      authenticated,
      asyncHandler(this.NotificationController.deleteAllNotifications)
    )
    this.routes.delete(
      '/:id',
      authenticated,
      validator(deleteNotificationSchema),
      asyncHandler(this.NotificationController.deleteNotification)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
