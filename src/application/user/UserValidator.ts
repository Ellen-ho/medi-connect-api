import Joi from 'joi'
import { UserRoleType } from '../../domain/user/User'

export const registerUserSchema = {
  body: Joi.object({
    displayName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string()
      .valid(...Object.values(UserRoleType))
      .required(),
  }),
}

export const logInUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}
