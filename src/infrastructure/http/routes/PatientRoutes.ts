import { Router } from 'express'
import { IPatientController } from '../controllers/PatientController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { validator } from '../middlewares/Validator'
import {
  creatPatientProfileSchema,
  editPatientProfileSchema,
} from '../../../application/patient/PatientValidator'
import { authenticated } from '../middlewares/Auth'
export class PatientRoutes {
  private readonly routes: Router
  constructor(private readonly patientController: IPatientController) {
    this.routes = Router()
    this.routes
      .post(
        '/profile',
        authenticated,
        validator(creatPatientProfileSchema),
        asyncHandler(this.patientController.createPatientProfile)
      )
      .patch(
        '/profile',
        authenticated,
        validator(editPatientProfileSchema),
        asyncHandler(this.patientController.editPatientProfile)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
