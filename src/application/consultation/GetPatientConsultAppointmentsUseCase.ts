import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
export interface ConsultAppointmentDatas {
  appointmentId: string
  patientId: string
  status: ConsultAppointmentStatusType
  doctorTimeSlot: {
    startAt: Date
    endAt: Date
  }
  doctor: {
    firstName: string
    lastName: string
    specialties: MedicalSpecialtyType[]
    avatar: string | null
  }
  meetingLink: string | null
  cancelAvailability: boolean
}

export interface ConsultAppointmentData {
  appointmentId: string
  patientId: string
  status: ConsultAppointmentStatusType
  doctorTimeSlot: {
    startAt: Date
    endAt: Date
  }
  doctor: {
    firstName: string
    lastName: string
    specialties: MedicalSpecialtyType[]
    avatar: string | null
  }
  meetingLink: string | null
  cancelAvailability: boolean
}

interface GetPatientConsultAppointmentsRequest {
  user: User
  onlyUpcoming?: boolean
}

interface GetPatientConsultAppointmentsResponse {
  upcomingAppointments: ConsultAppointmentDatas[]
  completedAppointments: ConsultAppointmentDatas[]
  canceledAppointments: ConsultAppointmentDatas[]
}

export class GetPatientConsultAppointmentsUseCase {
  constructor(
    private readonly consultAppointmentRepository: IConsultAppointmentRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: GetPatientConsultAppointmentsRequest
  ): Promise<GetPatientConsultAppointmentsResponse> {
    const { user, onlyUpcoming = false } = request

    const currentPatient = await this.patientRepository.findByUserId(user.id)

    if (currentPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const currentDate = dayjs()
    const currentMonthStartDate = dayjs(currentDate).startOf('month')
    const currentMonthEndDate = currentDate.endOf('month')
    const nextMonthEndDate = currentDate.add(1, 'month').endOf('month')

    let upComingEndDate
    if (currentDate.date() <= 28) {
      upComingEndDate = currentMonthEndDate
    } else {
      upComingEndDate = nextMonthEndDate
    }

    const upcomingAppointments =
      await this.consultAppointmentRepository.findByPatientIdAndStatusWithinDateRange(
        currentPatient.id,
        [ConsultAppointmentStatusType.UPCOMING],
        currentDate.toDate(),
        upComingEndDate.toDate()
      )

    const upcomingConsultAppointments: ConsultAppointmentDatas[] = []

    for (const appointment of upcomingAppointments) {
      const startTime = dayjs(appointment.doctorTimeSlot.startAt)
      const timeDifference = startTime.diff(currentDate, 'hour')

      const consultAppointmentData: ConsultAppointmentDatas = {
        appointmentId: appointment.appointmentId,
        patientId: appointment.patientId,
        status: appointment.status,
        doctorTimeSlot: {
          startAt: appointment.doctorTimeSlot.startAt,
          endAt: appointment.doctorTimeSlot.endAt,
        },
        doctor: {
          firstName: appointment.doctor.firstName,
          lastName: appointment.doctor.lastName,
          specialties: appointment.doctor.specialties,
          avatar: appointment.doctor.avatar,
        },
        meetingLink: timeDifference > 22 ? null : appointment.meetingLink,
        cancelAvailability: timeDifference > 24,
      }

      upcomingConsultAppointments.push(consultAppointmentData)
    }

    if (onlyUpcoming) {
      return {
        upcomingAppointments: upcomingConsultAppointments,
        completedAppointments: [],
        canceledAppointments: [],
      }
    }

    const completedAppointments =
      await this.consultAppointmentRepository.findByPatientIdAndStatusWithinDateRange(
        currentPatient.id,
        [ConsultAppointmentStatusType.COMPLETED],
        currentMonthStartDate.toDate(),
        currentMonthEndDate.toDate()
      )

    const canceledAppointments =
      await this.consultAppointmentRepository.findByPatientIdAndStatusWithinDateRange(
        currentPatient.id,
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
      patientId: appointment.patientId,
      status: appointment.status,
      doctorTimeSlot: {
        startAt: appointment.doctorTimeSlot.startAt,
        endAt: appointment.doctorTimeSlot.endAt,
      },
      doctor: {
        firstName: appointment.doctor.firstName,
        lastName: appointment.doctor.lastName,
        specialties: appointment.doctor.specialties,
        avatar: appointment.doctor.avatar,
      },
      meetingLink: null,
      cancelAvailability: false,
    }))
  }
}
