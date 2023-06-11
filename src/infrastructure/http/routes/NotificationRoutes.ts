import { Router } from 'express'
import { INotificationController } from '../controllers/NotificationController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { validator } from '../middlewares/Validator'
import {
  deleteNotificationSchema,
  getNotificationDetailsSchema,
} from '../../../application/notification/notificationValidator'

export class NotificationRoutes {
  private readonly routes: Router
  constructor(
    private readonly NotificationController: INotificationController
  ) {
    this.routes = Router()
    this.routes.get(
      '/hints',
      asyncHandler(this.NotificationController.getNotificationHints)
    )
    this.routes.get(
      '/:id',
      validator(getNotificationDetailsSchema),
      asyncHandler(this.NotificationController.getNotificationDetails)
    )
    this.routes.get(
      '/',
      asyncHandler(this.NotificationController.getNotificationLists)
    )
    this.routes.patch(
      '/read-all',
      asyncHandler(this.NotificationController.readAllNotifications)
    )
    this.routes.delete(
      '/all',
      asyncHandler(this.NotificationController.deleteAllNotifications)
    )
    this.routes.delete(
      '/:id',
      validator(deleteNotificationSchema),
      asyncHandler(this.NotificationController.deleteNotification)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
