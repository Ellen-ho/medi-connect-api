import { Router } from 'express'
import { UserRoutes } from './UserRoutes'

export class MainRoutes {
  private readonly routes: Router
  constructor(private readonly userRoutes: UserRoutes) {
    this.routes = Router()
  }

  public createRouter(): Router {
    this.routes.use('/users', this.userRoutes.createRouter())

    return this.routes
  }
}
