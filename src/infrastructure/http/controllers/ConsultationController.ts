import { Request, Response } from 'express'
import { CreateConsultAppointmentUseCase } from '../../../application/consultation/CreateConsultAppointmentUseCase'
import { CancelConsultAppointmentUseCase } from '../../../application/consultation/CancelConsultAppointmentUseCase'
import { CreateDoctorTimeSlotUseCase } from '../../../application/consultation/CreateDoctorTimeSlotUseCase'
import { EditDoctorTimeSlotUseCase } from '../../../application/consultation/EditDoctorTimeSlotUseCase'
import { User } from '../../../domain/user/User'
import { CreateMultipleTimeSlotsUseCase } from '../../../application/consultation/CreateMultipleTimeSlotsUseCase'
import { GetPatientConsultAppointmentsUseCase } from '../../../application/consultation/GetPatientConsultAppointmentsUseCase'
import { GetDoctorConsultAppointmentsUseCase } from '../../../application/consultation/GetDoctorConsultAppointmentsUseCase'
import { GetDoctorTimeSlotsUseCase } from '../../../application/consultation/GetDoctorTimeSlotsUseCase'

export interface IConsultationController {
  createConsultAppointment: (req: Request, res: Response) => Promise<Response>
  cancelConsultAppointment: (req: Request, res: Response) => Promise<Response>
  createDoctorTimeSlot: (req: Request, res: Response) => Promise<Response>
  editDoctorTimeSlot: (req: Request, res: Response) => Promise<Response>
  createMultipleTimeSlots: (req: Request, res: Response) => Promise<Response>
  getPatientConsultAppointments: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getDoctorConsultAppointments: (
    req: Request,
    res: Response
  ) => Promise<Response>
  getDoctorTimeSlots: (req: Request, res: Response) => Promise<Response>
}

export class ConsultationController implements IConsultationController {
  constructor(
    private readonly createConsultAppointmentUseCase: CreateConsultAppointmentUseCase,
    private readonly cancelConsultAppointmentUseCase: CancelConsultAppointmentUseCase,
    private readonly createDoctorTimeSlotUseCase: CreateDoctorTimeSlotUseCase,
    private readonly editDoctorTimeSlotUseCase: EditDoctorTimeSlotUseCase,
    private readonly createMultipleTimeSlotsUseCase: CreateMultipleTimeSlotsUseCase,
    private readonly getPatientConsultAppointmentsUseCase: GetPatientConsultAppointmentsUseCase,
    private readonly getDoctorConsultAppointmentsUseCase: GetDoctorConsultAppointmentsUseCase,
    private readonly getDoctorTimeSlotsUseCase: GetDoctorTimeSlotsUseCase
  ) {}

  public createConsultAppointment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      status: req.body.status,
      user: req.user as User,
      doctorTimeSlotId: req.body.doctorTimeSlotId,
    }
    const result = await this.createConsultAppointmentUseCase.execute(request)

    return res.status(200).json(result)
  }

  public cancelConsultAppointment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
      consultAppointmentId: req.params.id,
    }
    const result = await this.cancelConsultAppointmentUseCase.execute(request)

    return res.status(200).json(result)
  }

  public createDoctorTimeSlot = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { ...req.body, user: req.user as User }
    const result = await this.createDoctorTimeSlotUseCase.execute(request)

    return res.status(200).json(result)
  }

  public editDoctorTimeSlot = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      startAt: req.body.startAt,
      endAt: req.body.endAt,
      availability: req.body.availability,
      user: req.user as User,
      id: req.params.id,
    }
    const result = await this.editDoctorTimeSlotUseCase.execute(request)

    return res.status(200).json(result)
  }

  public createMultipleTimeSlots = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { ...req.body, user: req.user as User }
    const result = await this.createMultipleTimeSlotsUseCase.execute(request)
    return res.status(200).json(result)
  }

  public getPatientConsultAppointments = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
    }
    const result = await this.getPatientConsultAppointmentsUseCase.execute(
      request
    )
    return res.status(200).json(result)
  }

  public getDoctorConsultAppointments = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      user: req.user as User,
    }
    const result = await this.getDoctorConsultAppointmentsUseCase.execute(
      request
    )
    return res.status(200).json(result)
  }

  public getDoctorTimeSlots = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      doctorId: req.params.id,
      starAt:
        req.query.starAt !== undefined
          ? new Date(req.query.starAt as string)
          : undefined,
      endAt:
        req.query.endAt !== undefined
          ? new Date(req.query.endAt as string)
          : undefined,
    }

    const result = await this.getDoctorTimeSlotsUseCase.execute(request)

    return res.status(200).json(result)
  }
}
