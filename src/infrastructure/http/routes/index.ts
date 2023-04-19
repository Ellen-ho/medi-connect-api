import { Router } from 'express'
import { UserRoutes } from './UserRoutes'
import passport from '../../config/passport'

export class MainRoutes {
  private readonly routes: Router
  constructor(private readonly userRoutes: UserRoutes) {
    this.routes = Router()
    this.routes.use('/users', this.userRoutes.createRouter())
  }

  public createRouter(): Router {
    return this.routes
  }
}
