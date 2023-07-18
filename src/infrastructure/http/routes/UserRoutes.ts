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
import {
  editUserAccountSchema,
  logInUserSchema,
  registerUserSchema,
} from '../../../application/user/UserValidator'
export class UserRoutes {
  private readonly routes: Router
  constructor(private readonly userController: IUserController) {
    this.routes = Router()
    this.routes
      .get('/auth/facebook', facebookAuthenticator)
      .get('/auth/facebook/callback', facebookCallbackAuthenticator)
      .post(
        '/login',
        validator(logInUserSchema),
        authenticator,
        asyncHandler(this.userController.login)
      )
      .get(
        '/account',
        authenticated,
        asyncHandler(this.userController.getUserAccount)
      )
      .post(
        '/',
        validator(registerUserSchema),
        asyncHandler(this.userController.registerNewUser)
      )
      .patch(
        '/account',
        authenticated,
        validator(editUserAccountSchema),
        asyncHandler(this.userController.editUserAccount)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
