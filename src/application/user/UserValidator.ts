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

export const editUserAccountSchema = {
  body: Joi.object({
    displayName: Joi.string().optional(),
    password: Joi.string().optional(),
  }),
}

export const createPasswordChangeMailSchema = {
  body: Joi.object({
    email: Joi.string().required(),
  }),
}

export const updatePasswordSchema = {
  body: Joi.object({
    newPassword: Joi.string().required(),
    resetToken: Joi.string().required(),
  }),
}
