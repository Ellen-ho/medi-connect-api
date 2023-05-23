import { Router } from 'express'
import { IHealthGoalController } from '../controllers/HealthGoalController'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { createHealthGoalSchema } from '../../../application/goal/GoalValidator'

export class HealthGoalRoutes {
  private readonly routes: Router
  constructor(private readonly HealthGoalController: IHealthGoalController) {
    this.routes = Router()
    this.routes.post(
      '/',
      validator(createHealthGoalSchema),
      asyncHandler(this.HealthGoalController.createHealthGoal)
    )
  }

  public createRouter(): Router {
    return this.routes
  }
}
