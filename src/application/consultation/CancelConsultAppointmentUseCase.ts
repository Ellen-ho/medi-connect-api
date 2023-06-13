import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
import { IRepositoryTx } from '../../domain/shared/IRepositoryTx'
import { INotificationHelper } from '../notification/NotificationHelper'
import { NotificationType } from '../../domain/notification/Notification'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'

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
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly notifictionHelper: INotificationHelper,
    private readonly tx: IRepositoryTx
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

    const appointmentDoctor = await this.doctorRepository.findById(
      existingConsultAppointment.doctorTimeSlot.id
    )

    if (appointmentDoctor == null) {
      throw new Error('Doctor does not exist.')
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

    try {
      await this.tx.start()

      existingConsultAppointment.doctorTimeSlot.updateAvailability(true)

      await this.consultAppointmentRepository.save(existingConsultAppointment)

      await this.consultAppointmentRepository.deleteById(
        existingConsultAppointment.id
      )

      await this.tx.end()

      await this.notifictionHelper.createNotification({
        title: 'One of your appointments has been canceled.',
        content:
          'One of your appointments has been canceled.Please take a moment to review and confirm your appointment schedule.',
        notificationType: NotificationType.CANCEL_APPOINTMENT,
        user: appointmentDoctor.user,
      })

      return {
        consultAppointmentId,
        status: ConsultAppointmentStatusType.PATIENT_CANCELED,
      }
    } catch (error) {
      await this.tx.rollback()
      throw error
    }
  }
}
