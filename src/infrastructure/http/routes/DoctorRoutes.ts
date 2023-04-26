import { Router } from 'express'
import { IDoctorController } from '../controllers/DoctorController'
import { asyncHandler } from '../middlewares/AsyncHandler'

export class DoctorRoutes {
  private readonly routes: Router
  constructor(private readonly doctorController: IDoctorController) {
    this.routes = Router()
    this.routes
      .post('/profile', asyncHandler(this.doctorController.createDoctorProfile))
      .patch('/profile', asyncHandler(this.doctorController.editDoctorProfile))
  }

  public createRouter(): Router {
    return this.routes
  }
}
