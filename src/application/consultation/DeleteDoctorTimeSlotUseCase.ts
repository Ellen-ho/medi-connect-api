import dayjs from 'dayjs'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface DeleteDoctorTimeSlotRequest {
  user: User
  doctorTimeSlotId: string
}

interface DeleteDoctorTimeSlotResponse {
  deletedAt: Date
}

export class DeleteDoctorTimeSlotUseCase {
  constructor(
    private readonly doctorTimeSlotRepository: IDoctorTimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: DeleteDoctorTimeSlotRequest
  ): Promise<DeleteDoctorTimeSlotResponse> {
    try {
      const { user, doctorTimeSlotId } = request

      const existingDoctorTimeSlot =
        await this.doctorTimeSlotRepository.findById(doctorTimeSlotId)

      if (existingDoctorTimeSlot == null) {
        throw new NotFoundError('This doctor time slot does not exist.')
      }

      const currentDoctor = await this.doctorRepository.findByUserId(user.id)

      if (currentDoctor == null) {
        throw new AuthorizationError('Current doctor does not exist.')
      }

      //     const currentDate = dayjs()
      //     const thisMonthStartDate = currentDate.startOf('month')
      //     const nextMonthStartDate = currentDate.add(1, 'month').startOf('month')

      //     const nextNextMonthStartDate = currentDate.add(2, 'month').startOf('month')
      //     const nextNextMonthEndDate = currentDate.add(2, 'month').endOf('month')

      //     const thisMonthDivisionDate = thisMonthStartDate.set('date', 28)
      //     const nextMonthDivisionDate = nextMonthStartDate.set('date', 28)

      //     if (currentDate.isBefore(thisMonthDivisionDate)) {
      //       if (
      //         (dayjs(existingDoctorTimeSlot.startAt).isAfter(nextMonthStartDate) ||
      //           dayjs(existingDoctorTimeSlot.startAt).isSame(nextMonthStartDate)) &&
      //         dayjs(existingDoctorTimeSlot.startAt).isBefore(nextNextMonthStartDate)
      //       ) {
      //         await this.doctorTimeSlotRepository.deleteById(doctorTimeSlotId)
      //       } else {
      //         throw new ValidationError(
      //           'Before 28th of this month, you can only delete doctorTimeSlots of the next month.'
      //         )
      //       }
      //     }

      //     if (
      //       (currentDate.isAfter(thisMonthDivisionDate) ||
      //         currentDate.isSame(thisMonthDivisionDate)) &&
      //       currentDate.isBefore(nextMonthDivisionDate)
      //     ) {
      //       if (
      //         (dayjs(existingDoctorTimeSlot.startAt).isAfter(
      //           nextNextMonthStartDate
      //         ) ||
      //           dayjs(existingDoctorTimeSlot.startAt).isSame(
      //             nextNextMonthStartDate
      //           )) &&
      //         (dayjs(existingDoctorTimeSlot.startAt).isBefore(nextNextMonthEndDate) ||
      //           dayjs(existingDoctorTimeSlot.startAt).isSame(nextNextMonthEndDate))
      //       ) {
      //         await this.doctorTimeSlotRepository.deleteById(doctorTimeSlotId)
      //       } else {
      //         throw new ValidationError(
      //           'On or after 28th of this month to 27th of next month, you can only delete doctorTimeSlots of the next next month.'
      //         )
      //       }
      //     }
      //     return { deletedAt: new Date() }
      //   }
      // }

      const currentDate = dayjs()
      const nextMonthStartDate = currentDate.add(1, 'month').startOf('month')
      const nextMonthEndDate = currentDate.add(1, 'month').endOf('month')

      const nextNextMonthStartDate = currentDate
        .add(2, 'month')
        .startOf('month')
      const nextNextMonthEndDate = currentDate.add(2, 'month').endOf('month')

      const thisMonthStartDate = currentDate.startOf('month')

      const thisMonthDivisionDate = thisMonthStartDate.set('date', 28)
      const nextMonthDivisionDate = nextMonthStartDate.set('date', 28)

      // 當月28號前(不含28號)不能創下下月，不可創當月以前時間，只可創下月整月時間
      // 當月28號後(含28號)到下月28號前(不含28號)，不可創當月28後時間到下月整月時間，不可創下下下月，只可以創建下下月

      if (
        currentDate.isBefore(thisMonthDivisionDate, 'day') &&
        !(
          (dayjs(existingDoctorTimeSlot.startAt).isAfter(
            nextMonthStartDate,
            'day'
          ) ||
            dayjs(existingDoctorTimeSlot.startAt).isSame(
              nextMonthStartDate,
              'day'
            )) &&
          (dayjs(existingDoctorTimeSlot.startAt).isBefore(
            nextMonthEndDate,
            'day'
          ) ||
            dayjs(existingDoctorTimeSlot.startAt).isSame(
              nextMonthEndDate,
              'day'
            ))
        )
      ) {
        throw new ValidationError(
          'Doctor can only delete time slots of next month before 28th of this month.'
        )
      }

      if (
        (currentDate.isAfter(thisMonthDivisionDate, 'day') ||
          currentDate.isSame(thisMonthDivisionDate, 'day')) &&
        currentDate.isBefore(nextMonthDivisionDate, 'day') &&
        !(
          (dayjs(existingDoctorTimeSlot.startAt).isAfter(
            nextNextMonthStartDate,
            'day'
          ) ||
            dayjs(existingDoctorTimeSlot.startAt).isSame(
              nextNextMonthStartDate,
              'day'
            )) &&
          (dayjs(existingDoctorTimeSlot.startAt).isBefore(
            nextNextMonthEndDate,
            'day'
          ) ||
            dayjs(existingDoctorTimeSlot.startAt).isSame(
              nextNextMonthEndDate,
              'day'
            ))
        )
      ) {
        throw new ValidationError(
          'During 28th of this month to 27th of next month, doctor can only delete time slots of next next month.'
        )
      }

      await this.doctorTimeSlotRepository.deleteById(doctorTimeSlotId)

      return { deletedAt: new Date() }
    } catch (error) {
      console.error('Error executing DeleteDoctorTimeSlotUseCase:', error)
      throw error
    }
  }
}
