import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import {
  ConsultAppointment,
  ConsultAppointmentStatusType,
} from '../../domain/consultation/ConsultAppointment'
import dayjs from 'dayjs'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { INotificationHelper } from '../notification/NotificationHelper'
import { NotificationType } from '../../domain/notification/Notification'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IScheduler } from '../../infrastructure/network/Scheduler'
import { IMeetingLinkRepository } from '../../domain/meeting/interface/IMeetingLinkRepository'
import { MeetingLinkStatus } from '../../domain/meeting/MeetingLink'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface CreateConsultAppointmentRequest {
  user: User
  doctorTimeSlotId: string
}

interface CreateConsultAppointmentResponse {
  id: string
}

export class CreateConsultAppointmentUseCase {
  constructor(
    private readonly consultAppointmentRepository: IConsultAppointmentRepository,
    private readonly doctorTimeSlotRepository: IDoctorTimeSlotRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly meetingLinkRepository: IMeetingLinkRepository,
    private readonly uuidService: IUuidService,
    private readonly notifictionHelper: INotificationHelper,
    private readonly scheduler: IScheduler
  ) {}

  public async execute(
    request: CreateConsultAppointmentRequest
  ): Promise<CreateConsultAppointmentResponse> {
    const { user, doctorTimeSlotId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const existingDoctorTimeSlot = await this.doctorTimeSlotRepository.findById(
      doctorTimeSlotId
    )

    if (existingDoctorTimeSlot == null) {
      throw new AuthorizationError('Doctor time slot does not exist.')
    }

    const appointmentDoctor = await this.doctorRepository.findById(
      existingDoctorTimeSlot.doctorId
    )

    if (appointmentDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const currentDate = dayjs()

    const wantedAppointmentTime = existingDoctorTimeSlot.startAt
    const diffInHours = dayjs(wantedAppointmentTime).diff(currentDate, 'hour')

    if (diffInHours <= 24) {
      throw new ValidationError(
        'Appointment should be created before at least 24 hours.'
      )
    }

    const currentDateDay = currentDate.date()
    const currentMonthEndDate = currentDate.endOf('month')
    const nextMonthStartDate = currentDate.add(1, 'month').startOf('month')
    const nextMonthEndDate = currentDate.add(2, 'month').endOf('month')

    let isWithinCurrentMonthRange = false
    let isWithinNextMonthRange = false

    if (currentDateDay < 28) {
      const wantedAppointmentTime = dayjs(existingDoctorTimeSlot.startAt)
      isWithinCurrentMonthRange =
        (wantedAppointmentTime.isAfter(currentDate, 'day') &&
          wantedAppointmentTime.isBefore(currentMonthEndDate, 'day')) ||
        wantedAppointmentTime.isSame(currentMonthEndDate, 'day')

      if (!isWithinCurrentMonthRange) {
        throw new ValidationError(
          'Appointment is not within the current month range.'
        )
      }
    }

    if (currentDateDay >= 28) {
      const wantedAppointmentTime = dayjs(existingDoctorTimeSlot.startAt)
      isWithinCurrentMonthRange =
        dayjs(wantedAppointmentTime).isAfter(currentDate.date(), 'day') &&
        dayjs(wantedAppointmentTime).isBefore(currentMonthEndDate, 'day')

      isWithinNextMonthRange =
        dayjs(wantedAppointmentTime).isSame(nextMonthStartDate, 'day') ||
        (dayjs(wantedAppointmentTime).isAfter(nextMonthStartDate, 'day') &&
          dayjs(wantedAppointmentTime).isSame(nextMonthEndDate, 'day')) ||
        dayjs(wantedAppointmentTime).isBefore(nextMonthEndDate, 'day')

      if (!(isWithinCurrentMonthRange || isWithinNextMonthRange)) {
        throw new ValidationError(
          'Appointment is not within the current or next month range.'
        )
      }
    }

    existingDoctorTimeSlot.updateAvailability(false)

    const randomMeetingLink =
      await this.meetingLinkRepository.findRandomByStatus(
        MeetingLinkStatus.AVAILABLE
      )

    if (randomMeetingLink == null) {
      throw new AuthorizationError('No available meeting link.')
    }

    randomMeetingLink.setStatusToInUsed()
    await this.meetingLinkRepository.save(randomMeetingLink)

    const consultAppointment = new ConsultAppointment({
      id: this.uuidService.generateUuid(),
      patientId: existingPatient.id,
      doctorTimeSlot: existingDoctorTimeSlot,
      status: ConsultAppointmentStatusType.UPCOMING,
      meetingLink: randomMeetingLink.link,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.consultAppointmentRepository.save(consultAppointment)

    await this.notifictionHelper.createNotification({
      title: 'Hi, You have an appointment!',
      content:
        "You have an appointment. Please proceed to view your appointment records. Your permission to access the patient's health records has been enabled.",
      notificationType: NotificationType.CREATE_APPOINTMENT,
      referenceId: consultAppointment.id,
      user: appointmentDoctor.user,
    })

    const notificationTime = dayjs(existingDoctorTimeSlot.startAt)
      .subtract(22, 'hour')
      .toDate()

    this.scheduler.createJob(
      `${consultAppointment.id}_notification`,
      notificationTime,
      async () => {
        await this.notifictionHelper.createNotification({
          title: 'Appointment Reminder!',
          content: 'Your appointment is coming up soon.',
          notificationType: NotificationType.UPCOMING_APPOINTMENT,
          referenceId: consultAppointment.id,
          user: appointmentDoctor.user,
        })
        await this.notifictionHelper.createNotification({
          title: 'Appointment Reminder!',
          content: 'Your appointment is coming up soon.',
          notificationType: NotificationType.UPCOMING_APPOINTMENT,
          referenceId: consultAppointment.id,
          user: existingPatient.user,
        })

        this.scheduler.createJob(
          `${consultAppointment.id}_completed`,
          consultAppointment.doctorTimeSlot.endAt,
          async () => {
            consultAppointment.completeAppointment()
            await this.consultAppointmentRepository.save(consultAppointment)
          }
        )
      }
    )

    return {
      id: consultAppointment.id,
    }
  }
}
