import Joi from 'joi'

export const createConsultAppointmentSchema = {
  body: Joi.object({
    doctorTimeSlotId: Joi.string().required(),
  }),
}

export const cancelConsultAppointmentSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const createDoctorTimeSlotSchema = {
  body: Joi.object({
    startAt: Joi.date().required(),
    endAt: Joi.date().required(),
  }),
}

export const editDoctorTimeSlotSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    startAt: Joi.date().required(),
    endAt: Joi.date().required(),
  }),
}

export const createMultipleTimeSlotsSchema = {
  body: Joi.array().items(
    Joi.object({
      startAt: Joi.date().required(),
      endAt: Joi.date().required(),
    })
  ),
}
