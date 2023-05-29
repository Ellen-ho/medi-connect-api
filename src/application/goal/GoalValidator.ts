import Joi from 'joi'

export const activateHealthGoalSchema = {
  params: Joi.object({ healthGoalId: Joi.string().uuid().required() }),
}

export const rejectHealthGoalSchema = {
  params: Joi.object({ healthGoalId: Joi.string().uuid().required() }),
}

export const getHealthGoalSchema = {
  params: Joi.object({ healthGoalId: Joi.string().uuid().required() }),
}
