import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'

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
      throw new Error('The start and end cannot be empty after editing')
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