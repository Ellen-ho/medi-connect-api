import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
export interface ConsultAppointmentDatas {
  doctorId: string
  status: ConsultAppointmentStatusType
  startTime: Date
  endTime: Date
  patientFirstName: string
  patientLastName: string
  meetingLink: string | null
}

export interface ConsultAppointmentData {
  status: ConsultAppointmentStatusType
  doctorTimeSlot: {
    doctorId: string
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
  upComingAppointments: ConsultAppointmentDatas[]
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

    if (user.role === UserRoleType.PATIENT) {
      throw new Error('Only doctor can get the data')
    }

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
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
    const upComingAppointments =
      await this.consultAppointmentRepository.findByDoctorIdAndStatusWithinDateRange(
        existingDoctor.id,
        [ConsultAppointmentStatusType.UPCOMING],
        currentDate.toDate(),
        upComingEndDate.toDate()
      )
    if (upComingAppointments == null) {
      throw new Error('There is no upComing appointment.')
    }

    const upcomingConsultAppointments: ConsultAppointmentDatas[] = []

    for (const appointment of upComingAppointments) {
      const startTime = dayjs(appointment.doctorTimeSlot.startAt)
      const timeDifference = startTime.diff(currentDate, 'hour')

      const consultAppointmentData: ConsultAppointmentDatas = {
        doctorId: appointment.doctorTimeSlot.doctorId,
        status: appointment.status,
        startTime: appointment.doctorTimeSlot.startAt,
        endTime: appointment.doctorTimeSlot.endAt,
        patientFirstName: appointment.patient.firstName,
        patientLastName: appointment.patient.lastName,
        meetingLink: timeDifference > 22 ? null : appointment.meetingLink,
      }

      upcomingConsultAppointments.push(consultAppointmentData)
    }

    const completedAppointments =
      await this.consultAppointmentRepository.findByDoctorIdAndStatusWithinDateRange(
        existingDoctor.id,
        [ConsultAppointmentStatusType.COMPLETED],
        currentMonthStartDate.toDate(),
        currentMonthEndDate.toDate()
      )

    const canceledAppointments =
      await this.consultAppointmentRepository.findByDoctorIdAndStatusWithinDateRange(
        existingDoctor.id,
        [ConsultAppointmentStatusType.PATIENT_CANCELED],
        currentMonthStartDate.toDate(),
        currentMonthEndDate.toDate()
      )

    if (completedAppointments == null) {
      throw new Error('There is no completed appointment.')
    }

    if (canceledAppointments == null) {
      throw new Error('There is no canceled appointment.')
    }

    return {
      upComingAppointments: upcomingConsultAppointments,
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
      doctorId: appointment.doctorTimeSlot.doctorId,
      status: appointment.status,
      startTime: appointment.doctorTimeSlot.startAt,
      endTime: appointment.doctorTimeSlot.endAt,
      patientFirstName: appointment.patient.firstName,
      patientLastName: appointment.patient.lastName,
      meetingLink: null,
    }))
  }
}
