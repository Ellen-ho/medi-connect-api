import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateDoctorTimeSlotRequest {
  user: User
  doctorId: string
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
    const { user, doctorId, startAt, endAt } = request

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const doctorTimeSlot = new DoctorTimeSlot({
      id: this.uuidService.generateUuid(),
      doctorId,
      startAt,
      endAt,
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
