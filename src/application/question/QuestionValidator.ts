import Joi from 'joi'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'

export const createAnswerAgreementSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    comment: Joi.string().optional(),
  }),
}

export const creatAnswerAppreciationSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    content: Joi.string().optional(),
  }),
}

export const creatPatientQuestionAnswerSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    content: Joi.string().required(),
  }),
}

export const creatPatientQuestionSchema = {
  body: Joi.object({
    content: Joi.string().required(),
    medicalSpecialty: Joi.string()
      .valid(...Object.values(MedicalSpecialtyType))
      .required(),
  }),
}

export const cancelAnswerAgreementSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const cancelAnswerAppreciationSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const cancelPatientQuestionAnswerSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const cancelPatientQuestionSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getSingleQuestionSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getAnswerDetailsSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getAnswerListSchema = {
  query: Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
  }),
}
