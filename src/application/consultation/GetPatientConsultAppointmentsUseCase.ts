import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
export interface ConsultAppointmentDatas {
  patientId: string
  status: ConsultAppointmentStatusType
  startTime: Date
  endTime: Date
  doctorFirstName: string
  doctorLastName: string
  doctorSpecialties: MedicalSpecialtyType[]
}

export interface ConsultAppointmentData {
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
  }
}

interface GetPatientConsultAppointmentsRequest {
  user: User
}

interface GetPatientConsultAppointmentsResponse {
  upComingAppointments: ConsultAppointmentDatas[]
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
    const { user } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
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
      await this.consultAppointmentRepository.findByPatientIdAndStatusWithinDateRange(
        existingPatient.id,
        [ConsultAppointmentStatusType.UPCOMING],
        currentDate.toDate(),
        upComingEndDate.toDate()
      )

    const completedAppointments =
      await this.consultAppointmentRepository.findByPatientIdAndStatusWithinDateRange(
        existingPatient.id,
        [ConsultAppointmentStatusType.COMPLETED],
        currentMonthStartDate.toDate(),
        currentMonthEndDate.toDate()
      )

    const canceledAppointments =
      await this.consultAppointmentRepository.findByPatientIdAndStatusWithinDateRange(
        existingPatient.id,
        [ConsultAppointmentStatusType.PATIENT_CANCELED],
        currentMonthStartDate.toDate(),
        currentMonthEndDate.toDate()
      )

    if (upComingAppointments == null) {
      throw new Error('There is no upComing appointment.')
    }

    if (completedAppointments == null) {
      throw new Error('There is no completed appointment.')
    }

    if (canceledAppointments == null) {
      throw new Error('There is no canceled appointment.')
    }

    return {
      upComingAppointments:
        this.mapConsultAppointmentData(upComingAppointments),
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
      patientId: appointment.patientId,
      status: appointment.status,
      startTime: appointment.doctorTimeSlot.startAt,
      endTime: appointment.doctorTimeSlot.endAt,
      doctorFirstName: appointment.doctor.firstName,
      doctorLastName: appointment.doctor.lastName,
      doctorSpecialties: appointment.doctor.specialties,
    }))
  }
}
