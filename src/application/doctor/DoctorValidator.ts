import Joi from 'joi'
import { GenderType } from '../../domain/patient/Patient'

export const creatDoctorProfileSchema = {
  body: Joi.object({
    avatar: Joi.alternatives().try(Joi.string(), Joi.valid(null)),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    gender: Joi.string()
      .valid(...Object.values(GenderType))
      .required(),
    aboutMe: Joi.string().required(),
    languagesSpoken: Joi.string().required(),
    specialties: Joi.string().required(),
    careerStartDate: Joi.date().required(),
    officePracticalLocation: Joi.string()
      .valid(...Object.values(IAddress))
      .required(),
    education: Joi.string().required(),
    awards: Joi.string().optional(),
    affiliations: Joi.string().optional(),
  }),
}

export const editDoctorProfileSchema = {
  ...creatDoctorProfileSchema,
}
