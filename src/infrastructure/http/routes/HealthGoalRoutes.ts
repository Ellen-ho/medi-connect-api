import { Router } from 'express'
import { IHealthGoalController } from '../controllers/HealthGoalController'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  activateHealthGoalSchema,
  getHealthGoalListSchema,
  getHealthGoalSchema,
  rejectHealthGoalSchema,
} from '../../../application/goal/GoalValidator'

export class HealthGoalRoutes {
  private readonly routes: Router
  constructor(private readonly HealthGoalController: IHealthGoalController) {
    this.routes = Router()
    this.routes.post(
      '/',
      asyncHandler(this.HealthGoalController.createHealthGoal)
    )
    this.routes.get(
      '/:id',
      validator(getHealthGoalSchema),
      asyncHandler(this.HealthGoalController.getHealthGoal)
    )
    this.routes.get(
      '/',
      validator(getHealthGoalListSchema),
      asyncHandler(this.HealthGoalController.getHealthGoalList)
    )
    this.routes.patch(
      '/active/:id',
      validator(activateHealthGoalSchema),
      asyncHandler(this.HealthGoalController.activateHealthGoal)
    )
    this.routes.patch(
      '/reject/:id',
      validator(rejectHealthGoalSchema),
      asyncHandler(this.HealthGoalController.rejectHealthGoal)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
