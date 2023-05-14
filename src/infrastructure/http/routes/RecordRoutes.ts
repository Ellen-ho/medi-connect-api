import { Router } from 'express'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { IRecordController } from '../controllers/RecordController'

import { authenticated } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import {
  creatBloodPressureRecordSchema,
  creatBloodSugarRecordSchema,
  creatExerciseRecordSchema,
  creatFoodRecordSchema,
  creatGlycatedHemoglobinRecordSchema,
  creatSleepRecordSchema,
  creatWeightRecordSchema,
  editBloodPressureRecordSchema,
  editBloodSugarRecordSchema,
  editExerciseRecordSchema,
  editFoodRecordSchema,
  editGlycatedHemoglobinRecordSchema,
  editSleepRecordSchema,
  editWeightRecordSchema,
  getSingleBloodPressureRecordSchema,
  getSingleBloodSugarRecordSchema,
  getSingleExerciseRecordSchema,
  getSingleFoodRecordSchema,
  getSingleGlycatedHemoglobinRecordSchema,
  getSingleSleepRecordSchema,
} from '../../../application/record/RecordValidator'
export class RecordRoutes {
  private readonly routes: Router
  constructor(private readonly recordController: IRecordController) {
    this.routes = Router()
    this.routes
      .post(
        '/weight',
        authenticated,
        validator(creatWeightRecordSchema),
        asyncHandler(this.recordController.createWeightRecord)
      )
      .patch(
        '/weight/:id',
        authenticated,
        validator(editWeightRecordSchema),
        asyncHandler(this.recordController.editWeightRecord)
      )
      .post(
        '/blood-pressure',
        authenticated,
        validator(creatBloodPressureRecordSchema),
        asyncHandler(this.recordController.createBloodPressureRecord)
      )
      .patch(
        '/blood-pressure/:id',
        authenticated,
        validator(editBloodPressureRecordSchema),
        asyncHandler(this.recordController.editBloodPressureRecord)
      )
      .post(
        '/blood-sugar',
        authenticated,
        validator(creatBloodSugarRecordSchema),
        asyncHandler(this.recordController.createBloodSugarRecord)
      )
      .patch(
        '/blood-sugar/:id',
        authenticated,
        validator(editBloodSugarRecordSchema),
        asyncHandler(this.recordController.editBloodSugarRecord)
      )

      .post(
        '/exercise',
        authenticated,
        validator(creatExerciseRecordSchema),
        asyncHandler(this.recordController.createExerciseRecord)
      )
      .patch(
        '/exercise/:id',
        authenticated,
        validator(editExerciseRecordSchema),
        asyncHandler(this.recordController.editExerciseRecord)
      )
      .post(
        '/food',
        authenticated,
        validator(creatFoodRecordSchema),
        asyncHandler(this.recordController.createFoodRecord)
      )
      .patch(
        '/food/:id',
        authenticated,
        validator(editFoodRecordSchema),
        asyncHandler(this.recordController.editFoodRecord)
      )

      .post(
        '/glycated-hemoglobin',
        authenticated,
        validator(creatGlycatedHemoglobinRecordSchema),
        asyncHandler(this.recordController.createGlycatedHemoglobinRecord)
      )
      .patch(
        '/glycated-hemoglobin/:id',
        authenticated,
        validator(editGlycatedHemoglobinRecordSchema),
        asyncHandler(this.recordController.editGlycatedHemoglobinRecord)
      )

      .post(
        '/sleep',
        authenticated,
        validator(creatSleepRecordSchema),
        asyncHandler(this.recordController.createSleepRecord)
      )
      .patch(
        '/sleep/:id',
        authenticated,
        validator(editSleepRecordSchema),
        asyncHandler(this.recordController.editSleepRecord)
      )
      .get(
        '/exercise/:id',
        authenticated,
        validator(getSingleExerciseRecordSchema),
        asyncHandler(this.recordController.getSingleExerciseRecord)
      )
      .get(
        '/blood_presure/:id',
        authenticated,
        validator(getSingleBloodPressureRecordSchema),
        asyncHandler(this.recordController.getSingleBloodPressureRecord)
      )
      .get(
        '/blood_sugar/:id',
        authenticated,
        validator(getSingleBloodSugarRecordSchema),
        asyncHandler(this.recordController.getSingleBloodSugarRecord)
      )
      .get(
        '/food/:id',
        authenticated,
        validator(getSingleFoodRecordSchema),
        asyncHandler(this.recordController.getSingleFoodRecord)
      )
      .get(
        '/glycatedHemoglobin/:id',
        authenticated,
        validator(getSingleGlycatedHemoglobinRecordSchema),
        asyncHandler(this.recordController.getSingleGlycatedHemoglobinRecord)
      )
      .get(
        '/sleep/:id',
        authenticated,
        validator(getSingleSleepRecordSchema),
        asyncHandler(this.recordController.getSingleSleepRecord)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
