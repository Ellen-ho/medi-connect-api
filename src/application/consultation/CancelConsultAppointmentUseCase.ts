import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'

interface CancelConsultAppointmentRequest {
  user: User
  consultAppointmentId: string
}

interface CancelConsultAppointmentResponse {
  consultAppointmentId: string
  status: ConsultAppointmentStatusType
}

export class CancelConsultAppointmentUseCase {
  constructor(
    private readonly consultAppointmentRepository: IConsultAppointmentRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: CancelConsultAppointmentRequest
  ): Promise<CancelConsultAppointmentResponse> {
    const { user, consultAppointmentId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingConsultAppointment =
      await this.consultAppointmentRepository.findByIdAndPatientId(
        consultAppointmentId,
        existingPatient.id
      )
    if (existingConsultAppointment == null) {
      throw new Error('Consult appointment does not exist.')
    }

    const currentDate = new Date()
    const wantedAppointmentTime =
      existingConsultAppointment.doctorTimeSlot.startAt
    const diffInHours = dayjs(wantedAppointmentTime).diff(
      dayjs(currentDate),
      'hour'
    )

    if (diffInHours <= 24) {
      throw new Error('Appointment should be canceled before one day.')
    }

    existingConsultAppointment.doctorTimeSlot.updateAvailability(true)

    await this.consultAppointmentRepository.save(existingConsultAppointment)
    await this.consultAppointmentRepository.deleteById(
      existingConsultAppointment.id
    )

    return {
      consultAppointmentId,
      status: ConsultAppointmentStatusType.PATIENT_CANCELED,
    }
  }
}
