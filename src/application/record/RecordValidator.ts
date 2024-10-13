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
  query: Joi.object({ targetPatientId: Joi.string().uuid().required() }),
}

export const getSingleBloodPressureRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object({ targetPatientId: Joi.string().uuid().required() }),
}

export const getSingleBloodSugarRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object({ targetPatientId: Joi.string().uuid().required() }),
}

export const getSingleFoodRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object({ targetPatientId: Joi.string().uuid().required() }),
}

export const getSingleGlycatedHemoglobinRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object({ targetPatientId: Joi.string().uuid().required() }),
}

export const getSingleSleepRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object({ targetPatientId: Joi.string().uuid().required() }),
}

export const getSingleWeightRecordSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object({ targetPatientId: Joi.string().uuid().required() }),
}

export const getBloodPressureRecordsSchema = {
  query: Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    startDate: Joi.string().optional(),
    endDate: Joi.string().optional(),
    targetPatientId: Joi.string().uuid().required(),
  }).custom((value, helpers) => {
    const startDate = value.startDate as string
    const endDate = value.endDate as string

    if (startDate !== '' && endDate !== '') {
      {
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()

        if (end < start) {
          return helpers.error('any.invalid')
        }

        // const diffInDays = (end - start) / (1000 * 3600 * 24)
        // if (diffInDays > 31) {
        //   return helpers.error('any.invalid')
        // }
      }

      return value
    }
  }),
}

export const getBloodSugarRecordsSchema = {
  query: Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    startDate: Joi.string().optional(),
    endDate: Joi.string().optional(),
    targetPatientId: Joi.string().uuid().required(),
  }).custom((value, helpers) => {
    const startDate = value.startDate as string
    const endDate = value.endDate as string

    if (startDate !== '' && endDate !== '') {
      {
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()

        if (end < start) {
          return helpers.error('any.invalid')
        }

        // const diffInDays = (end - start) / (1000 * 3600 * 24)
        // if (diffInDays > 31) {
        //   return helpers.error('any.invalid')
        // }
      }

      return value
    }
  }),
}

export const getExerciseRecordsSchema = {
  query: Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    startDate: Joi.string().optional(),
    endDate: Joi.string().optional(),
    targetPatientId: Joi.string().uuid().required(),
  }).custom((value, helpers) => {
    const startDate = value.startDate as string
    const endDate = value.endDate as string

    if (startDate !== '' && endDate !== '') {
      {
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()

        if (end < start) {
          return helpers.error('any.invalid')
        }

        // const diffInDays = (end - start) / (1000 * 3600 * 24)
        // if (diffInDays > 31) {
        //   return helpers.error('any.invalid')
        // }
      }

      return value
    }
  }),
}

export const getFoodRecordsSchema = {
  query: Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    startDate: Joi.string().optional(),
    endDate: Joi.string().optional(),
    targetPatientId: Joi.string().uuid().required(),
  }).custom((value, helpers) => {
    const startDate = value.startDate as string
    const endDate = value.endDate as string

    if (startDate !== '' && endDate !== '') {
      {
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()

        if (end < start) {
          return helpers.error('any.invalid')
        }

        // const diffInDays = (end - start) / (1000 * 3600 * 24)
        // if (diffInDays > 31) {
        //   return helpers.error('any.invalid')
        // }
      }

      return value
    }
  }),
}

export const getGlycatedHemoglobinRecordsSchema = {
  query: Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    startDate: Joi.string().optional(),
    endDate: Joi.string().optional(),
    targetPatientId: Joi.string().uuid().required(),
  }).custom((value, helpers) => {
    const startDate = value.startDate as string
    const endDate = value.endDate as string

    if (startDate !== '' && endDate !== '') {
      {
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()

        if (end < start) {
          return helpers.error('any.invalid')
        }

        // const diffInDays = (end - start) / (1000 * 3600 * 24)
        // if (diffInDays > 31) {
        //   return helpers.error('any.invalid')
        // }
      }

      return value
    }
  }),
}

export const getSleepRecordsSchema = {
  query: Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    startDate: Joi.string().optional(),
    endDate: Joi.string().optional(),
    targetPatientId: Joi.string().uuid().required(),
  }).custom((value, helpers) => {
    const startDate = value.startDate as string
    const endDate = value.endDate as string

    if (startDate !== '' && endDate !== '') {
      {
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()

        if (end < start) {
          return helpers.error('any.invalid')
        }

        // const diffInDays = (end - start) / (1000 * 3600 * 24)
        // if (diffInDays > 31) {
        //   return helpers.error('any.invalid')
        // }
      }

      return value
    }
  }),
}

export const getWeightRecordsSchema = {
  query: Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    startDate: Joi.string().optional(),
    endDate: Joi.string().optional(),
    targetPatientId: Joi.string().uuid().required(),
  }).custom((value, helpers) => {
    const startDate = value.startDate as string
    const endDate = value.endDate as string

    if (startDate !== '' && endDate !== '') {
      {
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()

        if (end < start) {
          return helpers.error('any.invalid')
        }

        // const diffInDays = (end - start) / (1000 * 3600 * 24)
        // if (diffInDays > 31) {
        //   return helpers.error('any.invalid')
        // }
      }

      return value
    }
  }),
}

export const getGoalDurationRecordsSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object({ targetPatientId: Joi.string().uuid().required() }),
}
