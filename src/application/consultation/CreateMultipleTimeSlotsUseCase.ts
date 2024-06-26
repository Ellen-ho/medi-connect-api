import dayjs from 'dayjs'
import {
  DoctorTimeSlot,
  TimeSlotType,
} from '../../domain/consultation/DoctorTimeSlot'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface CreateMultipleTimeSlotsRequest {
  user: User
  timeSlots: Array<{ startAt: Date; endAt: Date; type: TimeSlotType }>
}

interface CreateMultipleTimeSlotsResponse {
  doctorId: string
  timeSlots: Array<{
    id: string
    startAt: Date
    endAt: Date
    type: TimeSlotType
  }>
}

export class CreateMultipleTimeSlotsUseCase {
  constructor(
    private readonly doctorTimeSlotRepository: IDoctorTimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateMultipleTimeSlotsRequest
  ): Promise<CreateMultipleTimeSlotsResponse> {
    const { user, timeSlots } = request

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const createdTimeSlots: DoctorTimeSlot[] = []

    const currentDate = dayjs()

    const nextMonthStartDate = currentDate.add(1, 'month').startOf('month')
    const nextMonthEndDate = currentDate.add(1, 'month').endOf('month')

    const nextNextMonthStartDate = currentDate.add(2, 'month').startOf('month')
    const nextNextMonthEndDate = currentDate.add(2, 'month').endOf('month')

    const thisMonthStartDate = currentDate.startOf('month')

    const thisMonthDivisionDate = thisMonthStartDate.set('date', 28)
    const nextMonthDivisionDate = nextMonthStartDate.set('date', 28)

    const unionType = timeSlots[0].type

    for (const timeSlot of timeSlots) {
      const { startAt, endAt, type } = timeSlot

      if (type !== unionType) {
        throw new ValidationError(
          'The type of time slot you input is different type.'
        )
      }

      const singleTimeSlot =
        await this.doctorTimeSlotRepository.findByStartAtAndDoctorId(
          startAt,
          existingDoctor.id
        )

      if (singleTimeSlot !== null) {
        throw new ValidationError('This time slot already exists.')
      }

      if (dayjs(startAt).isBefore(currentDate)) {
        throw new ValidationError(
          'Doctor cannot create time slots before the current time.'
        )
      }

      if (dayjs(startAt).isAfter(endAt)) {
        throw new ValidationError('The start time should before end time.')
      }

      const minimumOfEndAt = dayjs(startAt).add(30, 'minute')

      if (!dayjs(endAt).isSame(minimumOfEndAt)) {
        throw new ValidationError(
          'The end time should be 30 minutes after the start time.'
        )
      }

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
          'Doctor can only create time slots of the next month before the 28th of this month.'
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
          'During the 28th of this month to the 27th of next month, the doctor can only create time slots for the next next month.'
        )
      }

      const createdSingleTimeSlot = new DoctorTimeSlot({
        id: this.uuidService.generateUuid(),
        doctorId: existingDoctor.id,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        type: unionType,
      })

      await this.doctorTimeSlotRepository.save(createdSingleTimeSlot)

      createdTimeSlots.push(createdSingleTimeSlot)
    }

    return {
      doctorId: existingDoctor.id,
      timeSlots: createdTimeSlots.map((createdSingleTimeSlot) => ({
        id: createdSingleTimeSlot.id,
        startAt: createdSingleTimeSlot.startAt,
        endAt: createdSingleTimeSlot.endAt,
        type: createdSingleTimeSlot.type,
      })),
    }
  }
}
