import Joi from 'joi'
import {
  FamilyDiagnosisType,
  GenderType,
  MedicineFrequencyType,
  MedicineTimeType,
  MedicineUnitType,
  PersonalDiagnosisType,
} from '../../domain/patient/Patient'

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
      Joi.array().items(
        Joi.object({
          diagnosis: Joi.string()
            .valid(...Object.values(PersonalDiagnosisType))
            .required(),
          diagnosisDetails: Joi.string().optional(),
        })
      ),
      Joi.valid(null)
    ),
    allergy: Joi.object({
      medicine: Joi.string().allow(null),
      food: Joi.string().allow(null),
      other: Joi.string().allow(null),
    }),
    familyHistory: Joi.alternatives().try(
      Joi.array().items(
        Joi.object({
          relationship: Joi.string().required(),
          diagnosis: Joi.string()
            .valid(...Object.values(FamilyDiagnosisType))
            .required(),
          diagnosisDetails: Joi.string().optional(),
        })
      ),
      Joi.valid(null)
    ),
    medicinceUsage: Joi.alternatives().try(
      Joi.array().items(
        Joi.object({
          medicineName: Joi.string().required(),
          medicineDosage: Joi.number().required(),
          medicineUnit: Joi.string()
            .valid(...Object.values(MedicineUnitType))
            .required(),
          medicineFrequency: Joi.string()
            .valid(...Object.values(MedicineFrequencyType))
            .required(),
          medicineTime: Joi.string()
            .valid(...Object.values(MedicineTimeType))
            .required(),
        })
      ),
      Joi.valid(null)
    ),
    heightValueCm: Joi.number().required(),
  }),
}

export const editPatientProfileSchema = {
  ...creatPatientProfileSchema,
}
