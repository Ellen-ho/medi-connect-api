import Joi from 'joi'

export const createHealthGoalSchema = {
  params: Joi.object({ healthGoalId: Joi.string().uuid().required() }),
}
