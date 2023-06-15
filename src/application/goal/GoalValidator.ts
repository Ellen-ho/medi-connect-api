import Joi from 'joi'

export const activateHealthGoalSchema = {
  params: Joi.object({ id: Joi.string().uuid().required() }),
}

export const rejectHealthGoalSchema = {
  params: Joi.object({ id: Joi.string().uuid().required() }),
}

export const getHealthGoalSchema = {
  params: Joi.object({ id: Joi.string().uuid().required() }),
}

export const getHealthGoalListSchema = {
  query: Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    targetPatientId: Joi.string().uuid().required(),
  }),
}
