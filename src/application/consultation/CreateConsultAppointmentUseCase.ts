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
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateConsultAppointmentRequest
  ): Promise<CreateConsultAppointmentResponse> {
    const { user, doctorTimeSlotId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingDoctorTimeSlot = await this.doctorTimeSlotRepository.findById(
      doctorTimeSlotId
    )

    if (existingDoctorTimeSlot == null) {
      throw new Error('Doctor time slot does not exist.')
    }

    const currentDate = dayjs()

    const existingAppointment =
      await this.consultAppointmentRepository.findByPatientIdAndDate(
        existingPatient.id,
        currentDate.toDate()
      )

    if (existingAppointment !== null) {
      throw new Error('Patient already has an appointment for today.')
    }

    const wantedAppointmentTime = existingDoctorTimeSlot.startAt
    const diffInHours = dayjs(wantedAppointmentTime).diff(currentDate, 'hour')

    if (diffInHours <= 24) {
      throw new Error('Appointment should be created before one day.')
    }

    const currentMonthEndDate = currentDate.endOf('month')
    const nextMonthStartDate = currentDate.add(1, 'month').startOf('month')
    const nextMonthEndDate = currentDate.add(1, 'month').endOf('month')

    const currentYear = currentDate.year()
    const isLeapYear = this.checkLeapYear(currentYear)

    let isWithinCurrentMonthRange = false
    let isWithinNextMonthRange = false

    if (isLeapYear) {
      isWithinCurrentMonthRange =
        dayjs(wantedAppointmentTime).isSame(currentDate.date(28), 'day') ||
        (dayjs(wantedAppointmentTime).isAfter(currentDate.date(), 'day') &&
          dayjs(wantedAppointmentTime).isBefore(currentMonthEndDate, 'day') &&
          dayjs(wantedAppointmentTime).month() === currentDate.month())

      isWithinNextMonthRange =
        (dayjs(wantedAppointmentTime).isSame(nextMonthStartDate, 'day') ||
          dayjs(wantedAppointmentTime).isAfter(nextMonthStartDate, 'day')) &&
        dayjs(wantedAppointmentTime).isBefore(nextMonthEndDate, 'day') &&
        dayjs(wantedAppointmentTime).month() === nextMonthStartDate.month()
    } else {
      isWithinCurrentMonthRange =
        dayjs(wantedAppointmentTime).isSame(currentDate.date(28), 'day') ||
        (dayjs(wantedAppointmentTime).isAfter(currentDate.date(), 'day') &&
          dayjs(wantedAppointmentTime).isBefore(currentMonthEndDate, 'day'))

      isWithinNextMonthRange =
        (dayjs(wantedAppointmentTime).isSame(nextMonthStartDate, 'day') ||
          dayjs(wantedAppointmentTime).isAfter(nextMonthStartDate, 'day')) &&
        dayjs(wantedAppointmentTime).isBefore(nextMonthEndDate, 'day')
    }

    if (!isWithinCurrentMonthRange && !isWithinNextMonthRange) {
      throw new Error(
        'Appointment is not within the current or next month range.'
      )
    }

    existingDoctorTimeSlot.updateAvailability(false)

    const consultAppointment = new ConsultAppointment({
      id: this.uuidService.generateUuid(),
      patientId: existingPatient.id,
      doctorTimeSlot: existingDoctorTimeSlot,
      status: ConsultAppointmentStatusType.UPCOMING,
      createdAt: new Date(),
    })

    await this.consultAppointmentRepository.save(consultAppointment)

    return {
      id: consultAppointment.id,
    }
  }

  private checkLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }
}
