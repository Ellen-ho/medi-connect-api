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

export const editAnswerAgreementCommentSchema = {
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

export const editAnswerAppreciationContentSchema = {
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

export const editPatientQuestionAnswerSchema = {
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

export const editPatientQuestionSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
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
