import Joi from 'joi'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'

export const createAnswerAgreementSchema = {
  body: Joi.object({
    answerId: Joi.string().uuid().required(),
    comment: Joi.string().optional(),
  }),
}

export const editAnswerAgreementCommentSchema = {
  body: Joi.object({
    answerAgreementId: Joi.string().uuid().required(),
    comment: Joi.string().optional(),
  }),
}

export const creatAnswerAppreciationSchema = {
  body: Joi.object({
    answerId: Joi.string().uuid().required(),
    cobrent: Joi.string().optional(),
  }),
}

export const editAnswerAppreciationContentSchema = {
  body: Joi.object({
    answerAppreciationId: Joi.string().uuid().required(),
    content: Joi.string().optional(),
  }),
}

export const creatPatientQuestionAnswerSchema = {
  body: Joi.object({
    patientQuestionId: Joi.string().uuid().required(),
    content: Joi.string().required(),
  }),
}

export const editPatientQuestionAnswerSchema = {
  body: Joi.object({
    patientQuestionAnswerId: Joi.string().uuid().required(),
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
  body: Joi.object({
    patientQuestionId: Joi.string().uuid().required(),
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
