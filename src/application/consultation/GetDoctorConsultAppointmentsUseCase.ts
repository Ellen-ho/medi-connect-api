import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { User } from '../../domain/user/User'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
export interface ConsultAppointmentDatas {
  appointmentId: string
  status: ConsultAppointmentStatusType
  doctorTimeSlot: {
    startAt: Date
    endAt: Date
  }
  patient: {
    firstName: string
    lastName: string
  }
  meetingLink: string | null
}

export interface ConsultAppointmentData {
  appointmentId: string
  status: ConsultAppointmentStatusType
  doctorTimeSlot: {
    startAt: Date
    endAt: Date
  }
  patient: {
    firstName: string
    lastName: string
  }
  meetingLink: string | null
}

interface GetDoctorConsultAppointmentsRequest {
  user: User
}

interface GetDoctorConsultAppointmentsResponse {
  upcomingAppointments: ConsultAppointmentDatas[]
  completedAppointments: ConsultAppointmentDatas[]
  canceledAppointments: ConsultAppointmentDatas[]
}

export class GetDoctorConsultAppointmentsUseCase {
  constructor(
    private readonly consultAppointmentRepository: IConsultAppointmentRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: GetDoctorConsultAppointmentsRequest
  ): Promise<GetDoctorConsultAppointmentsResponse> {
    const { user } = request

    const currentDoctor = await this.doctorRepository.findByUserId(user.id)

    if (currentDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const currentDate = dayjs()
    const currentMonthStartDate = dayjs(currentDate).startOf('month')
    const currentMonthEndDate = currentDate.endOf('month')
    const nextMonthEndDate = currentDate.add(1, 'month').endOf('month')

    let upcomingEndDate
    if (currentDate.date() <= 28) {
      upcomingEndDate = currentMonthEndDate
    } else {
      upcomingEndDate = nextMonthEndDate
    }
    const upcomingAppointments =
      await this.consultAppointmentRepository.findByDoctorIdAndStatusWithinDateRange(
        currentDoctor.id,
        [ConsultAppointmentStatusType.UPCOMING],
        currentDate.toDate(),
        upcomingEndDate.toDate()
      )

    const upcomingConsultAppointments: ConsultAppointmentDatas[] = []

    for (const appointment of upcomingAppointments) {
      const startTime = dayjs(appointment.doctorTimeSlot.startAt)
      const timeDifference = startTime.diff(currentDate, 'hour')

      const consultAppointmentData: ConsultAppointmentDatas = {
        appointmentId: appointment.appointmentId,
        status: appointment.status,
        doctorTimeSlot: {
          startAt: appointment.doctorTimeSlot.startAt,
          endAt: appointment.doctorTimeSlot.endAt,
        },
        patient: {
          firstName: appointment.patient.firstName,
          lastName: appointment.patient.lastName,
        },
        meetingLink: timeDifference > 22 ? null : appointment.meetingLink,
      }

      upcomingConsultAppointments.push(consultAppointmentData)
    }

    const completedAppointments =
      await this.consultAppointmentRepository.findByDoctorIdAndStatusWithinDateRange(
        currentDoctor.id,
        [ConsultAppointmentStatusType.COMPLETED],
        currentMonthStartDate.toDate(),
        currentMonthEndDate.toDate()
      )

    const canceledAppointments =
      await this.consultAppointmentRepository.findByDoctorIdAndStatusWithinDateRange(
        currentDoctor.id,
        [ConsultAppointmentStatusType.PATIENT_CANCELED],
        currentMonthStartDate.toDate(),
        currentMonthEndDate.toDate()
      )

    return {
      upcomingAppointments: upcomingConsultAppointments,
      completedAppointments: this.mapConsultAppointmentData(
        completedAppointments
      ),
      canceledAppointments:
        this.mapConsultAppointmentData(canceledAppointments),
    }
  }

  private mapConsultAppointmentData(
    appointments: ConsultAppointmentData[]
  ): ConsultAppointmentDatas[] {
    return appointments.map((appointment) => ({
      appointmentId: appointment.appointmentId,
      status: appointment.status,
      doctorTimeSlot: {
        startAt: appointment.doctorTimeSlot.startAt,
        endAt: appointment.doctorTimeSlot.endAt,
      },
      patient: {
        firstName: appointment.patient.firstName,
        lastName: appointment.patient.lastName,
      },
      meetingLink: null,
    }))
  }
}
