import dayjs from 'dayjs'
import { DoctorTimeSlot } from '../../domain/consultation/DoctorTimeSlot'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateMultipleTimeSlotsRequest {
  user: User
  timeSlots: Array<{ startAt: Date; endAt: Date }>
}

interface CreateMultipleTimeSlotsResponse {
  id: string
  timeSlots: Array<{
    id: string
    startAt: Date
    endAt: Date
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
      throw new Error('Doctor does not exist.')
    }

    const createdTimeSlots: DoctorTimeSlot[] = []

    for (const timeSlot of timeSlots) {
      const { startAt, endAt } = timeSlot

      const singleTimeSlot =
        await this.doctorTimeSlotRepository.findByStartAtAndDoctorId(
          new Date(startAt),
          existingDoctor.id
        )

      if (singleTimeSlot != null) {
        throw new Error('This time slot already exists.')
      }

      const currentDate = new Date()
      if (dayjs(currentDate).isSame(startAt, 'month')) {
        throw new Error('Doctor cannot create the time slot in the same month.')
      }

      const createdSingleTimeSlot = new DoctorTimeSlot({
        id: this.uuidService.generateUuid(),
        doctorId: existingDoctor.id,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await this.doctorTimeSlotRepository.save(createdSingleTimeSlot)

      createdTimeSlots.push(createdSingleTimeSlot)
    }

    return {
      id: existingDoctor.id,
      timeSlots: createdTimeSlots.map((createdSingleTimeSlot) => ({
        id: createdSingleTimeSlot.id,
        startAt: createdSingleTimeSlot.startAt,
        endAt: createdSingleTimeSlot.endAt,
      })),
    }
  }
}
