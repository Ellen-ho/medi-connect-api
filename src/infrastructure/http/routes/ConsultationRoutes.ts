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
} from '../../../application/consultation/ConsultationValidator'

export class ConsultationRoutes {
  private readonly routes: Router
  constructor(
    private readonly consultationController: IConsultationController
  ) {
    this.routes = Router()
    this.routes
      .delete(
        '/:id',
        validator(cancelConsultAppointmentSchema),
        asyncHandler(this.consultationController.cancelConsultAppointment)
      )
      .post(
        '/time-slot',
        validator(createDoctorTimeSlotSchema),
        asyncHandler(this.consultationController.createDoctorTimeSlot)
      )
      .patch(
        '/time-slot/:id',
        validator(editDoctorTimeSlotSchema),
        asyncHandler(this.consultationController.editDoctorTimeSlot)
      )
      .post(
        '/multiple-time-slots',
        validator(createMultipleTimeSlotsSchema),
        asyncHandler(this.consultationController.createMultipleTimeSlots)
      )
      .post(
        '/',
        validator(createConsultAppointmentSchema),
        asyncHandler(this.consultationController.createConsultAppointment)
      )
      .get(
        '/patient',
        asyncHandler(this.consultationController.getPatientConsultAppointments)
      )
      .get(
        '/doctor',
        asyncHandler(this.consultationController.getDoctorConsultAppointments)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
