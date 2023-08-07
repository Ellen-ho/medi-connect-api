import { Router } from 'express'
import { IPatientController } from '../controllers/PatientController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { validator } from '../middlewares/Validator'
import {
  creatPatientProfileSchema,
  editPatientProfileSchema,
  getPatientProfileSchema,
} from '../../../application/patient/PatientValidator'
import { authenticated } from '../middlewares/Auth'
import upload from '../middlewares/multer'
export class PatientRoutes {
  private readonly routes: Router
  constructor(private readonly patientController: IPatientController) {
    this.routes = Router()
    this.routes
      .post(
        '/profile',
        authenticated,
        upload.single('image'),
        validator(creatPatientProfileSchema),
        asyncHandler(this.patientController.createPatientProfile)
      )
      .patch(
        '/profile',
        authenticated,
        upload.single('image'),
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
