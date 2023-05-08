import { Request, Response } from 'express'
import { CreateConsultAppointmentUseCase } from '../../../application/consultation/CreateConsultAppointmentUseCase'
import { CancelConsultAppointmentUseCase } from '../../../application/consultation/CancelConsultAppointmentUseCase'
import { CreateDoctorTimeSlotUseCase } from '../../../application/consultation/CreateDoctorTimeSlotUseCase'
import { EditDoctorTimeSlotUseCase } from '../../../application/consultation/EditDoctorTimeSlotUseCase'
import { User } from '../../../domain/user/User'

export interface IConsultationController {
  createConsultAppointment: (req: Request, res: Response) => Promise<Response>
  cancelConsultAppointment: (req: Request, res: Response) => Promise<Response>
  createDoctorTimeSlot: (req: Request, res: Response) => Promise<Response>
  editDoctorTimeSlot: (req: Request, res: Response) => Promise<Response>
}

export class ConsultationController implements IConsultationController {
  constructor(
    private readonly createConsultAppointmentUseCase: CreateConsultAppointmentUseCase,
    private readonly cancelConsultAppointmentUseCase: CancelConsultAppointmentUseCase,
    private readonly createDoctorTimeSlotUseCase: CreateDoctorTimeSlotUseCase,
    private readonly editDoctorTimeSlotUseCase: EditDoctorTimeSlotUseCase
  ) {}

  public createConsultAppointment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        status: req.body.status,
        user: req.user as User,
        doctorTimeSlotId: req.params.id,
      }
      const result = await this.createConsultAppointmentUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public cancelConsultAppointment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        user: req.user as User,
        consultAppointmentId: req.params.id,
      }
      const result = await this.cancelConsultAppointmentUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res
        .status(400)
        .json({ message: 'cancel consult appointment error' })
    }
  }

  public createDoctorTimeSlot = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const result = await this.createDoctorTimeSlotUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editDoctorTimeSlot = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        startAt: req.body.startAt,
        endAt: req.body.endAt,
        availability: req.body.availability,
        user: req.user as User,
        doctorTimeSlotId: req.params.id,
      }
      const result = await this.editDoctorTimeSlotUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: 'edit doctor time slot error' })
    }
  }
}