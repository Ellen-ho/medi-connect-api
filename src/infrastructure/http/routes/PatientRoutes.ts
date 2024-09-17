import { Router } from 'express'
import { IPatientController } from '../controllers/PatientController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { validator } from '../middlewares/Validator'
import {
  editPatientProfileSchema,
  getPatientProfileSchema,
} from '../../../application/patient/PatientValidator'
import { authenticated } from '../middlewares/Auth'
export class PatientRoutes {
  private readonly routes: Router
  constructor(private readonly patientController: IPatientController) {
    this.routes = Router()
    this.routes
      .patch(
        '/profile',
        authenticated,
        validator(editPatientProfileSchema),
        asyncHandler(this.patientController.editPatientProfile)
      )
      .get(
        '/profile',
        authenticated,
        validator(getPatientProfileSchema),
        asyncHandler(this.patientController.getPatientProfile)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
