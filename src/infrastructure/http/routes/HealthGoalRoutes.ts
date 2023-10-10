import { Router } from 'express'
import { IHealthGoalController } from '../controllers/HealthGoalController'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  activateHealthGoalSchema,
  getHealthGoalListSchema,
  getHealthGoalSchema,
  rejectHealthGoalSchema,
  updateGoalResultSchema,
} from '../../../application/goal/GoalValidator'
import { authenticated } from '../middlewares/Auth'

export class HealthGoalRoutes {
  private readonly routes: Router
  constructor(private readonly HealthGoalController: IHealthGoalController) {
    this.routes = Router()
    this.routes.post(
      '/',
      authenticated,
      asyncHandler(this.HealthGoalController.createHealthGoal)
    )
    this.routes.get(
      '/:id',
      authenticated,
      validator(getHealthGoalSchema),
      asyncHandler(this.HealthGoalController.getHealthGoal)
    )
    this.routes.get(
      '/',
      authenticated,
      validator(getHealthGoalListSchema),
      asyncHandler(this.HealthGoalController.getHealthGoalList)
    )
    this.routes.patch(
      '/active/:id',
      authenticated,
      validator(activateHealthGoalSchema),
      asyncHandler(this.HealthGoalController.activateHealthGoal)
    )
    this.routes.patch(
      '/reject/:id',
      authenticated,
      validator(rejectHealthGoalSchema),
      asyncHandler(this.HealthGoalController.rejectHealthGoal)
    )
    this.routes.patch(
      '/update-result/:id',
      validator(updateGoalResultSchema),
      authenticated,
      asyncHandler(this.HealthGoalController.updateGoalResult)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
