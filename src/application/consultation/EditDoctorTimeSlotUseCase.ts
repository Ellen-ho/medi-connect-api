import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import dayjs from 'dayjs'

interface EditDoctorTimeSlotRequest {
  user: User
  doctorTimeSlotId: string
  startAt: number
  endAt: number
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

    if (startAt == null || endAt == null) {
      throw new Error('The start and end cannot be empty after editing.')
    }

    if (dayjs(startAt).isAfter(endAt)) {
      throw new Error('The start time should before end time.')
    }

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const existingDoctorTimeSlot =
      await this.doctorTimeSlotRepository.findByIdAndDoctorId(
        doctorTimeSlotId,
        existingDoctor.id
      )

    if (existingDoctorTimeSlot == null) {
      throw new Error('Doctor time Slot does not exist.')
    }

    const depulicatedDoctorTimeSlot =
      await this.doctorTimeSlotRepository.findByStartAtAndDoctorId(
        new Date(startAt * 1000),
        existingDoctor.id
      )

    if (depulicatedDoctorTimeSlot != null) {
      throw new Error(
        "This doctor's time slot has already exists and the time is duplicated."
      )
    }

    const currentDate = new Date()
    if (dayjs(currentDate).isSame(startAt, 'month')) {
      throw new Error('Doctor cannot edit the time slot in the same month.')
    }

    existingDoctorTimeSlot.updateData({
      startAt: new Date(startAt * 1000),
      endAt: new Date(endAt * 1000),
    })

    await this.doctorTimeSlotRepository.save(existingDoctorTimeSlot)

    return {
      id: existingDoctorTimeSlot.id,
      startAt: new Date(startAt * 1000),
      endAt: existingDoctorTimeSlot.endAt,
      updatedAt: existingDoctorTimeSlot.updatedAt,
    }
  }
}
