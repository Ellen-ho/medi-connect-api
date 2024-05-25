import dayjs from 'dayjs'
import {
  TimeSlotType,
  DoctorTimeSlot,
} from '../../domain/consultation/DoctorTimeSlot'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface CreateDoctorTimeSlotRequest {
  user: User
  startAt: Date
  endAt: Date
  type: TimeSlotType
}

interface CreateDoctorTimeSlotResponse {
  id: string
  doctorId: string
  startAt: Date
  endAt: Date
  createdAt: Date
  updatedAt: Date
  type: TimeSlotType
}

export class CreateDoctorTimeSlotUseCase {
  constructor(
    private readonly doctorTimeSlotRepository: IDoctorTimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateDoctorTimeSlotRequest
  ): Promise<CreateDoctorTimeSlotResponse> {
    const { user, startAt, endAt, type } = request

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const existingDoctorTimeSlot =
      await this.doctorTimeSlotRepository.findByStartAtAndDoctorId(
        new Date(startAt),
        existingDoctor.id
      )

    if (existingDoctorTimeSlot !== null) {
      throw new ValidationError("This doctor's time slot has already exists.")
    }

    const currentDate = dayjs()

    const minimumOfEndAt = dayjs(startAt).add(30, 'minute')

    if (dayjs(startAt).isBefore(currentDate)) {
      throw new ValidationError(
        'Doctor cannot create time slots before the current time.'
      )
    }

    if (dayjs(startAt).isAfter(endAt)) {
      throw new ValidationError('The start time should before end time.')
    }

    if (!dayjs(endAt).isSame(minimumOfEndAt)) {
      throw new ValidationError(
        'The end time should be 30 minutes after the start time.'
      )
    }

    const nextMonthStartDate = currentDate.add(1, 'month').startOf('month')
    const nextMonthEndDate = currentDate.add(1, 'month').endOf('month')

    const nextNextMonthStartDate = currentDate.add(2, 'month').startOf('month')
    const nextNextMonthEndDate = currentDate.add(2, 'month').endOf('month')

    const thisMonthStartDate = currentDate.startOf('month')

    const thisMonthDivisionDate = thisMonthStartDate.set('date', 28)
    const nextMonthDivisionDate = nextMonthStartDate.set('date', 28)

    if (
      currentDate.isBefore(thisMonthDivisionDate, 'day') &&
      !(
        (dayjs(startAt).isAfter(nextMonthStartDate, 'day') ||
          dayjs(startAt).isSame(nextMonthStartDate, 'day')) &&
        (dayjs(startAt).isBefore(nextMonthEndDate, 'day') ||
          dayjs(startAt).isSame(nextMonthEndDate, 'day'))
      )
    ) {
      throw new ValidationError(
        'Doctor can only create time slots of next month before 28th of this month.'
      )
    }

    if (
      (currentDate.isAfter(thisMonthDivisionDate, 'day') ||
        currentDate.isSame(thisMonthDivisionDate, 'day')) &&
      currentDate.isBefore(nextMonthDivisionDate, 'day') &&
      !(
        (dayjs(startAt).isAfter(nextNextMonthStartDate, 'day') ||
          dayjs(startAt).isSame(nextNextMonthStartDate, 'day')) &&
        (dayjs(startAt).isBefore(nextNextMonthEndDate, 'day') ||
          dayjs(startAt).isSame(nextNextMonthEndDate, 'day'))
      )
    ) {
      throw new ValidationError(
        'During 28th of this month to 27th of next month, doctor can only create time slots of next next month.'
      )
    }

    const doctorTimeSlot = new DoctorTimeSlot({
      id: this.uuidService.generateUuid(),
      doctorId: existingDoctor.id,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      availability: true, // after creating availability will be availability
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      type,
    })
    await this.doctorTimeSlotRepository.save(doctorTimeSlot)

    return {
      id: doctorTimeSlot.id,
      doctorId: doctorTimeSlot.doctorId,
      startAt: doctorTimeSlot.startAt,
      endAt: doctorTimeSlot.endAt,
      createdAt: doctorTimeSlot.createdAt,
      updatedAt: doctorTimeSlot.updatedAt,
      type: doctorTimeSlot.type,
    }
  }
}
