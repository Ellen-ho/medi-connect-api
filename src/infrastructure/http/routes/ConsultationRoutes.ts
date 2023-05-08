import { Router } from 'express'
import { IConsultationController } from '../controllers/ConsultationController'
import { validator } from '../middlewares/Validator'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  cancelConsultAppointmentSchema,
  createConsultAppointmentSchema,
  createDoctorTimeSlotSchema,
  editDoctorTimeSlotSchema,
} from '../../../application/consultation/ConsultationValidator'

export class ConsultationRoutes {
  private readonly routes: Router
  constructor(
    private readonly consultationController: IConsultationController
  ) {
    this.routes = Router()
    this.routes
      .post(
        '/',
        validator(createConsultAppointmentSchema),
        asyncHandler(this.consultationController.createConsultAppointment)
      )
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
  }

  public createRouter(): Router {
    return this.routes
  }
}
