import { Router } from 'express'
import { IUserController } from '../controllers/UserController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { authenticated, authenticator } from '../middlewares/Auth'
export class UserRoutes {
  private readonly routes: Router
  constructor(private readonly userController: IUserController) {
    this.routes = Router()
    this.routes
      .post('/login', authenticator, asyncHandler(this.userController.login))
      .get('/me', authenticated, asyncHandler(this.userController.getUserById))
      .post(
        '/',
        authenticated,
        asyncHandler(this.userController.registerNewUser)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
