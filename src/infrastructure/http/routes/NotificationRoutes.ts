import { Router } from 'express'
import { INotificationController } from '../controllers/NotificationController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { validator } from '../middlewares/Validator'
import { getNotificationDetailsSchema } from '../../../application/notification/notificationValidator'

export class NotificationRoutes {
  private readonly routes: Router
  constructor(
    private readonly NotificationController: INotificationController
  ) {
    this.routes = Router()
    this.routes.get(
      '/',
      asyncHandler(this.NotificationController.getNotificationLists)
    )
    this.routes.get(
      '/:id',
      validator(getNotificationDetailsSchema),
      asyncHandler(this.NotificationController.getNotificationDetails)
    )
    this.routes.get(
      '/hints',
      asyncHandler(this.NotificationController.getNotificationHints)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
