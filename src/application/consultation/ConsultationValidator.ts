import { TimeSlotType } from 'domain/consultation/DoctorTimeSlot'
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
    type: Joi.string()
      .valid(...Object.values(TimeSlotType))
      .required(),
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
  query: Joi.object({
    type: Joi.string()
      .valid(...Object.values(TimeSlotType))
      .required(),
  }),
}

export const createMultipleTimeSlotsSchema = {
  body: Joi.object({
    timeSlots: Joi.array().items(
      Joi.object({
        startAt: Joi.date().required(),
        endAt: Joi.date().required(),
        type: Joi.string()
          .valid(...Object.values(TimeSlotType))
          .required(),
      })
    ),
  }),
}

export const getDoctorTimeSlotsSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object({
    type: Joi.string()
      .valid(...Object.values(TimeSlotType))
      .required(),
  }),
}

export const deleteDoctorTimeSlotSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}
