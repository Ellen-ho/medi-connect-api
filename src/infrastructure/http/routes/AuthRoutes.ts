import { Router } from 'express'
import {
  facebookAuthenticator,
  facebookCallbackAuthenticator,
} from '../middlewares/Auth'

export class AuthRoutes {
  private readonly routes: Router

  constructor() {
    this.routes = Router()

    this.routes.get('/facebook', facebookAuthenticator)

    this.routes.get('/facebook/callback', facebookCallbackAuthenticator)
  }

  public createRouter(): Router {
    return this.routes
  }
}
