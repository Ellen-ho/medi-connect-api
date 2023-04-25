import { Router } from 'express'
import { IPatientController } from '../controllers/PatientController'
import { asyncHandler } from '../middlewares/AsyncHandler'
export class PatientRoutes {
  private readonly routes: Router
  constructor(private readonly patientController: IPatientController) {
    this.routes = Router()
    this.routes
      .post(
        '/profile',
        asyncHandler(this.patientController.createPatientProfile)
      )
      .patch(
        '/profile',
        asyncHandler(this.patientController.editPatientProfile)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
