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
  }

  public createRouter(): Router {
    return this.routes
  }
}
