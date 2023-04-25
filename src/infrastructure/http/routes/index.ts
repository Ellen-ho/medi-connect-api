import { Router } from 'express'
import { PatientRoutes } from './PatientRoutes'
import { UserRoutes } from './UserRoutes'
import { RecordRoutes } from './RecordRoutes'
import { authenticated } from '../middlewares/Auth'

export class MainRoutes {
  private readonly routes: Router
  constructor(
    private readonly userRoutes: UserRoutes,
    private readonly patientRoutes: PatientRoutes,
    private readonly recordRoutes: RecordRoutes
  ) {
    this.routes = Router()
    this.routes.use('/users', this.userRoutes.createRouter())
    this.routes.use(
      '/patients',
      authenticated,
      this.patientRoutes.createRouter()
    )
    this.routes.use('/records', authenticated, this.recordRoutes.createRouter())
  }

  public createRouter(): Router {
    return this.routes
  }
}
