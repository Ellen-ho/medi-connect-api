import { Router } from 'express'
import { IUserController } from '../controllers/UserController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  authenticated,
  authenticator,
  facebookAuthenticator,
  facebookCallbackAuthenticator,
} from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import { registerUserSchema } from '../../../application/user/UserValidator'
export class UserRoutes {
  private readonly routes: Router
  constructor(private readonly userController: IUserController) {
    this.routes = Router()
    this.routes
      .get('/auth/facebook', facebookAuthenticator)
      .get('/auth/facebook/callback', facebookCallbackAuthenticator)
      .post('/login', authenticator, asyncHandler(this.userController.login))
      .get('/me', authenticated, asyncHandler(this.userController.getUserById))
      .post(
        '/',
        validator(registerUserSchema),
        asyncHandler(this.userController.registerNewUser)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
