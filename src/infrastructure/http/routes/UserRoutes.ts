import { Router } from 'express'
import { IUserController } from '../controllers/UserController'
import { asyncHandler } from '../middlewares/AsyncHandler'

export class UserRoutes {
  private readonly routes: Router
  constructor(private readonly userController: IUserController) {
    this.routes = Router()
    this.routes.get('/:id', asyncHandler(this.userController.getUserById))
    this.routes.post('/', asyncHandler(this.userController.registerNewUser))
  }

  public createRouter(): Router {
    return this.routes
  }
}
