import Joi from 'joi'

export const CreateHealthGoalSchema = {
  params: Joi.object({ healthGoalId: Joi.string().uuid().required() }),
}
