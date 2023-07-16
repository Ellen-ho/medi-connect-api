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
    languagesSpoken: Joi.array().items(Joi.string().required()),
    specialties: Joi.array().items(Joi.string().required()),
    careerStartDate: Joi.date().required(),
    officePracticalLocation: Joi.object({
      line1: Joi.string().required(),
      line2: Joi.string().optional(),
      city: Joi.string().required(),
      stateProvince: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      country: Joi.string().required(),
      countryCode: Joi.string().required(),
    }).required(),
    education: Joi.array().items(Joi.string().required()),
    awards: Joi.alternatives().try(
      Joi.array().items(Joi.string().required()),
      Joi.valid(null)
    ),
    affiliations: Joi.alternatives().try(
      Joi.array().items(Joi.string().required()),
      Joi.valid(null)
    ),
  }),
}

export const editDoctorProfileSchema = {
  ...creatDoctorProfileSchema,
}

export const getDoctorStatisticSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getDoctorProfileSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}
