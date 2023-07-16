import { Router } from 'express'
import { IConsultationController } from '../controllers/ConsultationController'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  cancelConsultAppointmentSchema,
  createConsultAppointmentSchema,
  createDoctorTimeSlotSchema,
  createMultipleTimeSlotsSchema,
  editDoctorTimeSlotSchema,
  getDoctorTimeSlotsSchema,
} from '../../../application/consultation/ConsultationValidator'
import { authenticated } from '../middlewares/Auth'

export class ConsultationRoutes {
  private readonly routes: Router
  constructor(
    private readonly consultationController: IConsultationController
  ) {
    this.routes = Router()
    this.routes
      .delete(
        '/:id',
        authenticated,
        validator(cancelConsultAppointmentSchema),
        asyncHandler(this.consultationController.cancelConsultAppointment)
      )
      .post(
        '/time-slot',
        authenticated,
        validator(createDoctorTimeSlotSchema),
        asyncHandler(this.consultationController.createDoctorTimeSlot)
      )
      .patch(
        '/time-slot/:id',
        authenticated,
        validator(editDoctorTimeSlotSchema),
        asyncHandler(this.consultationController.editDoctorTimeSlot)
      )
      .post(
        '/multiple-time-slots',
        authenticated,
        validator(createMultipleTimeSlotsSchema),
        asyncHandler(this.consultationController.createMultipleTimeSlots)
      )
      .post(
        '/',
        authenticated,
        validator(createConsultAppointmentSchema),
        asyncHandler(this.consultationController.createConsultAppointment)
      )
      .get(
        '/patient',
        authenticated,
        asyncHandler(this.consultationController.getPatientConsultAppointments)
      )
      .get(
        '/doctor',
        authenticated,
        asyncHandler(this.consultationController.getDoctorConsultAppointments)
      )
      .get(
        '/time-slots/doctors/:id',
        authenticated,
        validator(getDoctorTimeSlotsSchema),
        asyncHandler(this.consultationController.getDoctorTimeSlots)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
