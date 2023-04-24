import Joi from 'joi'
import { UserRoleType } from '../../domain/user/User'

export const loginUserSchema = {
  body: Joi.object({
    displayName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string()
      .valid(...Object.values(UserRoleType))
      .required(),
  }),
}
