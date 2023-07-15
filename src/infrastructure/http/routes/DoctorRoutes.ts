import { Router } from 'express'
import { IDoctorController } from '../controllers/DoctorController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  creatDoctorProfileSchema,
  editDoctorProfileSchema,
  getDoctorStatisticSchema,
} from '../../../application/doctor/DoctorValidator'
import { authenticated } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'

export class DoctorRoutes {
  private readonly routes: Router
  constructor(private readonly doctorController: IDoctorController) {
    this.routes = Router()
    this.routes
      .post(
        '/profile',
        authenticated,
        validator(creatDoctorProfileSchema),
        asyncHandler(this.doctorController.createDoctorProfile)
      )
      .patch(
        '/profile',
        authenticated,
        validator(editDoctorProfileSchema),
        asyncHandler(this.doctorController.editDoctorProfile)
      )
      .get(
        '/profile',
        authenticated,
        asyncHandler(this.doctorController.getDoctorProfile)
      )
      .get(
        '/:id/statistic',
        authenticated,
        validator(getDoctorStatisticSchema),
        asyncHandler(this.doctorController.getDoctorStatistic)
      )
      .get(
        '/',
        authenticated,
        asyncHandler(this.doctorController.getDoctorList)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
