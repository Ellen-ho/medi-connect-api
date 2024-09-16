import { Router } from 'express'
import { ICommonController } from '../controllers/CommonController'
import { asyncHandler } from '../middlewares/AsyncHandler'

export class CommonRoutes {
  private readonly routes: Router
  constructor(private readonly commonController: ICommonController) {
    this.routes = Router()
    this.routes.get(
      '/load_doctors',
      asyncHandler(this.commonController.getDoctors)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
