import { Router } from 'express'
import {
  facebookAuthenticator,
  facebookCallbackAuthenticator,
} from '../middlewares/Auth'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { IUserController } from '../controllers/UserController'

export class AuthRoutes {
  private readonly routes: Router

  constructor(private readonly userController: IUserController) {
    this.routes = Router()

    this.routes.get('/facebook', facebookAuthenticator) // redirect user to FB login page
    this.routes.get('/facebook/callback', facebookCallbackAuthenticator) // FE hit this endpoint after FB login
    this.routes.get('/success', asyncHandler(this.userController.login)) // FE hit this endpoint for getting access token
  }

  public createRouter(): Router {
    return this.routes
  }
}
