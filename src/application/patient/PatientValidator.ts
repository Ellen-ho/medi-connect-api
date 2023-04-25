import Joi from 'joi'

export const registerUserSchema = {
  body: Joi.object({
    //   displayName: Joi.string().required(),
    //   email: Joi.string().email().required(),
    //   password: Joi.string().required(),
    //   role: Joi.string()
    //     .valid(...Object.values(UserRoleType))
    //     .required(),
    other: Joi.alternatives().try(
      Joi.string(), // allows non-empty string
      Joi.valid(null) // allows null
    ),
  }),
}
