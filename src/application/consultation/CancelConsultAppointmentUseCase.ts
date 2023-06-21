import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
import { IRepositoryTx } from '../../domain/shared/IRepositoryTx'
import { INotificationHelper } from '../notification/NotificationHelper'
import { NotificationType } from '../../domain/notification/Notification'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IScheduler } from '../../infrastructure/network/Scheduler'
import { IMeetingLinkRepository } from '../../domain/meeting/interface/IMeetingLinkRepository'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

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
    private readonly meetingLinkRepository: IMeetingLinkRepository,
    private readonly notifictionHelper: INotificationHelper,
    private readonly tx: IRepositoryTx,
    private readonly scheduler: IScheduler
  ) {}

  public async execute(
    request: CancelConsultAppointmentRequest
  ): Promise<CancelConsultAppointmentResponse> {
    const { user, consultAppointmentId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const existingConsultAppointment =
      await this.consultAppointmentRepository.findByIdAndPatientId(
        consultAppointmentId,
        existingPatient.id
      )
    if (existingConsultAppointment == null) {
      throw new NotFoundError('Consult appointment does not exist.')
    }

    const appointmentDoctor = await this.doctorRepository.findById(
      existingConsultAppointment.doctorTimeSlot.id
    )

    if (appointmentDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const currentDate = new Date()
    const wantedAppointmentTime =
      existingConsultAppointment.doctorTimeSlot.startAt
    const diffInHours = dayjs(wantedAppointmentTime).diff(
      dayjs(currentDate),
      'hour'
    )

    if (diffInHours <= 24) {
      throw new ValidationError(
        'Appointment should be canceled before one day.'
      )
    }

    try {
      await this.tx.start()
      const txExecutor = this.tx.getExecutor()

      existingConsultAppointment.doctorTimeSlot.updateAvailability(true)

      if (existingConsultAppointment.meetingLink == null) {
        throw new NotFoundError('The meeting link does not exist')
      }

      const existingMeetingLink = await this.meetingLinkRepository.findByLink(
        existingConsultAppointment.meetingLink
      )

      if (existingMeetingLink !== null) {
        existingMeetingLink.setStatusToAvailable()
        await this.meetingLinkRepository.save(existingMeetingLink, txExecutor)
      }

      await this.consultAppointmentRepository.save(
        existingConsultAppointment,
        txExecutor
      )

      await this.consultAppointmentRepository.deleteById(
        existingConsultAppointment.id,
        txExecutor
      )

      this.scheduler.cancelJob(`${existingConsultAppointment.id}_notification`)

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
