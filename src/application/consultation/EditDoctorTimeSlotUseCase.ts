import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import dayjs from 'dayjs'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface EditDoctorTimeSlotRequest {
  user: User
  doctorTimeSlotId: string
  startAt: Date
  endAt: Date
}

interface EditDoctorTimeSlotResponse {
  id: string
  startAt: Date
  endAt: Date
  updatedAt: Date
}

export class EditDoctorTimeSlotUseCase {
  constructor(
    private readonly doctorTimeSlotRepository: IDoctorTimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: EditDoctorTimeSlotRequest
  ): Promise<EditDoctorTimeSlotResponse> {
    const { user, doctorTimeSlotId, startAt, endAt } = request

    const currentDate = dayjs()
    const minimumOfEndAt = dayjs(startAt).add(30, 'minute')

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new AuthorizationError('Doctor does not exist.')
    }

    const existingDoctorTimeSlot =
      await this.doctorTimeSlotRepository.findByIdAndDoctorId(
        doctorTimeSlotId,
        existingDoctor.id
      )

    if (existingDoctorTimeSlot == null) {
      throw new NotFoundError('Doctor time Slot does not exist.')
    }

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

    // 更改後的時間表不能早於現在時間(包括年月日時分秒)
    // 如:同一天，晚上不能創白天時間表
    if (dayjs(startAt).isBefore(currentDate)) {
      throw new ValidationError(
        'Time slots can not be before the current time.'
      )
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

    // 當月28號前(不含28號)不能創下下月，不可創當月以前時間，只可創下月整月時間
    // 當月28號後(含28號)到下月28號前(不含28號)，不可創當月28後時間到下月整月時間，不可創下下下月，只可以創建下下月

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

    existingDoctorTimeSlot.updateData({
      startAt,
      endAt,
    })

    await this.doctorTimeSlotRepository.save(existingDoctorTimeSlot)

    return {
      id: existingDoctorTimeSlot.id,
      startAt: existingDoctorTimeSlot.startAt,
      endAt: existingDoctorTimeSlot.endAt,
      updatedAt: existingDoctorTimeSlot.updatedAt,
    }
  }
}
