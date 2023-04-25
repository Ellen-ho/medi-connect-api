import { Router } from 'express'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { IRecordController } from '../controllers/RecordController'
export class RecordRoutes {
  private readonly routes: Router
  constructor(private readonly recordController: IRecordController) {
    this.routes = Router()
    this.routes
      .post(
        '/weightRecord',
        asyncHandler(this.recordController.createWeightRecord)
      )
      .patch(
        '/weightRecord/:id',
        asyncHandler(this.recordController.editWeightRecord)
      )
      .post(
        '/bloodPressureRecord',
        asyncHandler(this.recordController.createBloodPressureRecord)
      )
      .patch(
        '/bloodPressure/:id',
        asyncHandler(this.recordController.editBloodPressureRecord)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
