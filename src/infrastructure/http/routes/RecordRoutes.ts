import { Router } from 'express'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { IRecordController } from '../controllers/RecordController'
export class RecordRoutes {
  private readonly routes: Router
  constructor(private readonly recordController: IRecordController) {
    this.routes = Router()
    this.routes
      .post('/weight', asyncHandler(this.recordController.createWeightRecord))
      .patch(
        '/weight/:id',
        asyncHandler(this.recordController.editWeightRecord)
      )
      .post(
        '/blood-pressure',
        asyncHandler(this.recordController.createBloodPressureRecord)
      )
      .patch(
        '/blood-pressure/:id',
        asyncHandler(this.recordController.editBloodPressureRecord)
      )
      .post(
        '/blood-sugar',
        asyncHandler(this.recordController.createBloodSugarRecord)
      )
      .patch(
        '/blood-sugar/:id',
        asyncHandler(this.recordController.editBloodSugarRecord)
      )

      .post(
        '/exercise',
        asyncHandler(this.recordController.createExerciseRecord)
      )
      .patch(
        '/exercise/:id',
        asyncHandler(this.recordController.editExerciseRecord)
      )

      .post('/food', asyncHandler(this.recordController.createFoodRecord))
      .patch('/food/:id', asyncHandler(this.recordController.editFoodRecord))

      .post(
        '/glycated-hemoglobin',
        asyncHandler(this.recordController.createGlycatedHemoglobinRecord)
      )
      .patch(
        '/glycated-hemoglobin/:id',
        asyncHandler(this.recordController.editGlycatedHemoglobinRecord)
      )

      .post('/sleep', asyncHandler(this.recordController.createSleepRecord))
      .patch('/sleep/:id', asyncHandler(this.recordController.editSleepRecord))
  }

  public createRouter(): Router {
    return this.routes
  }
}
