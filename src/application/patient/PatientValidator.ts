import Joi from 'joi'
import { GenderType } from '../../domain/patient/Patient'

export const creatPatientProfileSchema = {
  body: Joi.object({
    avatar: Joi.alternatives().try(Joi.string(), Joi.valid(null)),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthDate: Joi.date().required(),
    gender: Joi.string()
      .valid(...Object.values(GenderType))
      .required(),
    medicalHistory: Joi.alternatives().try(
      Joi.array().items(Joi.object()),
      Joi.valid(null)
    ),
    allergy: Joi.string().required(),
    familyHistory: Joi.alternatives().try(
      Joi.array().items(Joi.object()),
      Joi.valid(null)
    ),
    heightValueCm: Joi.number().required(),
  }),
}

export const editPatientProfileSchema = {
  body: Joi.object({
    avatar: Joi.alternatives().try(Joi.string(), Joi.valid(null)),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthDate: Joi.date().required(),
    gender: Joi.string()
      .valid(...Object.values(GenderType))
      .required(),
    medicalHistory: Joi.alternatives().try(
      Joi.array().items(Joi.object()),
      Joi.valid(null)
    ),
    allergy: Joi.string().required(),
    familyHistory: Joi.alternatives().try(
      Joi.array().items(Joi.object()),
      Joi.valid(null)
    ),
    heightValueCm: Joi.number().required(),
  }),
}
