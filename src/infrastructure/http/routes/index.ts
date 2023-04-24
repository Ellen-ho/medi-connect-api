import { Router } from 'express'
import { PatientRoutes } from './PatientRoutes'
import { UserRoutes } from './UserRoutes'

export class MainRoutes {
  private readonly routes: Router
  constructor(
    private readonly userRoutes: UserRoutes,
    private readonly patientRoutes: PatientRoutes
  ) {
    this.routes = Router()
    this.routes.use('/users', this.userRoutes.createRouter())
    this.routes.use('/patients', this.patientRoutes.createRouter())
  }

  public createRouter(): Router {
    return this.routes
  }
}
