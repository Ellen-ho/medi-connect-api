import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'

interface EditDoctorTimeSlotRequest {
  user: User
  doctorTimeSlotId: string
  starAt: Date
  endAt: Date
}

interface EditDoctorTimeSlotResponse {
  id: string
  starAt: Date
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
    const { user, doctorTimeSlotId, starAt, endAt } = request

    if (starAt == null || endAt == null) {
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

    existingDoctorTimeSlot.updateData({ starAt, endAt })

    await this.doctorTimeSlotRepository.save(existingDoctorTimeSlot)

    return {
      id: existingDoctorTimeSlot.id,
      starAt: existingDoctorTimeSlot.starAt,
      endAt: existingDoctorTimeSlot.endAt,
      updatedAt: existingDoctorTimeSlot.updatedAt,
    }
  }
}
