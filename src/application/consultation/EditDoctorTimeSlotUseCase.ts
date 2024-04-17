import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import dayjs from 'dayjs'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'
import { TimeSlotType } from '../../domain/consultation/DoctorTimeSlot'

interface EditDoctorTimeSlotRequest {
  user: User
  id: string
  startAt: Date
  endAt: Date
  type: TimeSlotType
}

interface EditDoctorTimeSlotResponse {
  id: string
  startAt: Date
  endAt: Date
  updatedAt: Date
  type: TimeSlotType
}

export class EditDoctorTimeSlotUseCase {
  constructor(
    private readonly doctorTimeSlotRepository: IDoctorTimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: EditDoctorTimeSlotRequest
  ): Promise<EditDoctorTimeSlotResponse> {
    const { user, id, startAt, endAt, type } = request

    const currentDate = dayjs()
    const minimumOfEndAt = dayjs(startAt).add(30, 'minute')

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const existingDoctorTimeSlot =
      await this.doctorTimeSlotRepository.findByIdAndDoctorId(
        id,
        existingDoctor.id
      )

    if (existingDoctorTimeSlot == null) {
      throw new NotFoundError('Doctor time Slot does not exist.')
    }

    if (type === existingDoctorTimeSlot.type) {
      const depulicatedDoctorTimeSlot =
        await this.doctorTimeSlotRepository.findByStartAtAndDoctorId(
          startAt,
          existingDoctor.id
        )

      if (depulicatedDoctorTimeSlot != null) {
        throw new ValidationError(
          "This doctor's time slot has already exists and the time is duplicated."
        )
      }
    }

    if (dayjs(startAt).isBefore(currentDate)) {
      throw new ValidationError('Time slot can not be before the current time.')
    }

    if (dayjs(startAt).isAfter(endAt)) {
      throw new ValidationError('The start time should before end time.')
    }

    if (dayjs(endAt).isBefore(minimumOfEndAt)) {
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
        'Doctor can only edit time slots of next month before 28th of this month.'
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
        'During 28th of this month to 27th of next month, doctor can only edit time slots of next next month.'
      )
    }

    existingDoctorTimeSlot.updateData({
      startAt,
      endAt,
      type,
    })

    await this.doctorTimeSlotRepository.save(existingDoctorTimeSlot)

    return {
      id: existingDoctorTimeSlot.id,
      startAt: existingDoctorTimeSlot.startAt,
      endAt: existingDoctorTimeSlot.endAt,
      updatedAt: existingDoctorTimeSlot.updatedAt,
      type: existingDoctorTimeSlot.type,
    }
  }
}
