import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import dayjs from 'dayjs'

interface EditDoctorTimeSlotRequest {
  user: User
  doctorTimeSlotId: string
  startAt: Date
  endAt: Date
  availability: boolean
}

interface EditDoctorTimeSlotResponse {
  id: string
  startAt: Date
  endAt: Date
  updatedAt: Date
  availability: boolean
}

export class EditDoctorTimeSlotUseCase {
  constructor(
    private readonly doctorTimeSlotRepository: IDoctorTimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: EditDoctorTimeSlotRequest
  ): Promise<EditDoctorTimeSlotResponse> {
    const { user, doctorTimeSlotId, startAt, endAt, availability } = request

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
        startAt,
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

    existingDoctorTimeSlot.updateData({ startAt, endAt, availability })

    await this.doctorTimeSlotRepository.save(existingDoctorTimeSlot)

    return {
      id: existingDoctorTimeSlot.id,
      startAt: existingDoctorTimeSlot.startAt,
      endAt: existingDoctorTimeSlot.endAt,
      availability: existingDoctorTimeSlot.availability,
      updatedAt: existingDoctorTimeSlot.updatedAt,
    }
  }
}
