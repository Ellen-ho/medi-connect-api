import { Router } from 'express'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { authenticated } from '../middlewares/Auth'
import { IRecordController } from '../controllers/RecordController'
export class RecordRoutes {
  private readonly routes: Router
  constructor(private readonly recordController: IRecordController) {
    this.routes = Router()
    this.routes
      .post(
        '/weightRecord',
        authenticated,
        asyncHandler(this.recordController.createWeightRecord)
      )
      .patch(
        '/weightRecord/:id',
        authenticated,
        asyncHandler(this.recordController.editWeightRecord)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
