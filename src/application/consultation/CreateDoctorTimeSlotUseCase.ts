import dayjs from 'dayjs'
import { DoctorTimeSlot } from '../../domain/consultation/DoctorTimeSlot'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateDoctorTimeSlotRequest {
  user: User
  startAt: Date
  endAt: Date
}

interface CreateDoctorTimeSlotResponse {
  id: string
  doctorId: string
  startAt: Date
  endAt: Date
  createdAt: Date
  updatedAt: Date
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
    const { user, startAt, endAt } = request

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const existingDoctorTimeSlot =
      await this.doctorTimeSlotRepository.findByStartAtAndDoctorId(
        new Date(startAt),
        existingDoctor.id
      )

    if (existingDoctorTimeSlot != null) {
      throw new Error("This doctor's time slot has already exists.")
    }

    const currentDate = dayjs()
    // const currentDate = dayjs('2021-01-07 15:30:00')

    const minimumOfEndAt = dayjs(startAt).add(30, 'minute')

    // 創建的時間表不能早於現在時間(包括年月日時分秒)
    // 如:同一天，晚上不能創白天時間表
    if (dayjs(startAt).isBefore(currentDate)) {
      throw new Error(
        'Doctor cannot create time slots before the current time.'
      )
    }

    if (dayjs(startAt).isAfter(endAt)) {
      throw new Error('The start time should before end time.')
    }

    if (dayjs(endAt).isBefore(minimumOfEndAt)) {
      throw new Error('The end time should be 30 minutes after the start time.')
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
      throw new Error(
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
      throw new Error(
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
    })
    await this.doctorTimeSlotRepository.save(doctorTimeSlot)

    return {
      id: doctorTimeSlot.id,
      doctorId: doctorTimeSlot.doctorId,
      startAt: doctorTimeSlot.startAt,
      endAt: doctorTimeSlot.endAt,
      createdAt: doctorTimeSlot.createdAt,
      updatedAt: doctorTimeSlot.updatedAt,
    }
  }
}
