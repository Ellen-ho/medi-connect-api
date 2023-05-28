import Joi from 'joi'
import { ExerciseType, IntensityType } from '../../domain/record/ExerciseRecord'
import { FoodCategoryType } from '../../domain/record/FoodRecord'
import { SleepQualityType } from '../../domain/record/SleepRecord'

export const creatBloodPressureRecordSchema = {
  body: Joi.object({
    bloodPressureDate: Joi.date().required(),
    systolicBloodPressure: Joi.number().required(),
    diastolicBloodPressure: Joi.number().required(),
    heartBeat: Joi.number().required(),
    bloodPressureNote: Joi.string().optional(),
  }),
}

export const editBloodPressureRecordSchema = {
  ...creatBloodPressureRecordSchema,
}

export const creatBloodSugarRecordSchema = {
  body: Joi.object({
    bloodSugarDate: Joi.date().required(),
    bloodSugarValue: Joi.number().required(),
    bloodSugarNote: Joi.string().optional(),
  }),
}

export const editBloodSugarRecordSchema = {
  ...creatBloodSugarRecordSchema,
}

export const creatExerciseRecordSchema = {
  body: Joi.object({
    exerciseDate: Joi.date().required(),
    // exerciseDate: Joi.date().timestamp('unix').required(),
    exerciseType: Joi.string()
      .valid(...Object.values(ExerciseType))
      .required(),
    exerciseDurationMinute: Joi.number().required(),
    exerciseIntensity: Joi.string()
      .valid(...Object.values(IntensityType))
      .required(),
    exerciseNote: Joi.string().optional(),
  }),
}

export const editExerciseRecordSchema = {
  ...creatExerciseRecordSchema,
}

export const creatFoodRecordSchema = {
  body: Joi.object({
    foodTime: Joi.date().required(),
    foodCategory: Joi.string()
      .valid(...Object.values(FoodCategoryType))
      .required(),
    foodAmount: Joi.number().required(),
    foodNote: Joi.string().optional(),
  }),
}

export const editFoodRecordSchema = {
  ...creatFoodRecordSchema,
}

export const creatGlycatedHemoglobinRecordSchema = {
  body: Joi.object({
    glycatedHemoglobinDate: Joi.date().required(),
    glycatedHemoglobinValuePercent: Joi.number().required(),
  }),
}

export const editGlycatedHemoglobinRecordSchema = {
  ...creatGlycatedHemoglobinRecordSchema,
}

export const creatSleepRecordSchema = {
  body: Joi.object({
    sleepDate: Joi.date().required(),
    sleepTime: Joi.date().required(),
    wakeUpTime: Joi.date().required(),
    sleepQuality: Joi.string()
      .valid(...Object.values(SleepQualityType))
      .required(),
    sleepDurationHour: Joi.number().required(),
    sleepNote: Joi.string().optional(),
  }),
}

export const editSleepRecordSchema = {
  ...creatSleepRecordSchema,
}

export const creatWeightRecordSchema = {
  body: Joi.object({
    weightDate: Joi.date().required(),
    weightValueKg: Joi.number().required(),
    weightNote: Joi.string().optional(),
  }),
}

export const editWeightRecordSchema = {
  ...creatWeightRecordSchema,
}

export const getSingleExerciseRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getSingleBloodPressureRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getSingleBloodSugarRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getSingleFoodRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getSingleGlycatedHemoglobinRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getSingleSleepRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getSingleWeightRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getExerciseRecordsSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}
