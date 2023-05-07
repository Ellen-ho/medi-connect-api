import { DoctorTimeSlot } from '../../domain/consultation/DoctorTimeSlot'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateDoctorTimeSlotRequest {
  user: User
  startAt: Date
  endAt: Date
  availability: boolean
}

interface CreateDoctorTimeSlotResponse {
  id: string
  doctorId: string
  startAt: Date
  endAt: Date
  availability: boolean
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
    const { user, startAt, endAt, availability } = request

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const existingDoctorTimeSlot =
      await this.doctorTimeSlotRepository.findByStartAtAndDoctorId(
        startAt,
        existingDoctor.id
      )

    if (existingDoctorTimeSlot != null) {
      throw new Error("This doctor's time slot has already exists.")
    }

    const doctorTimeSlot = new DoctorTimeSlot({
      id: this.uuidService.generateUuid(),
      doctorId: existingDoctor.id,
      startAt,
      endAt,
      availability,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await this.doctorTimeSlotRepository.save(doctorTimeSlot)

    return {
      id: doctorTimeSlot.id,
      doctorId: doctorTimeSlot.doctorId,
      startAt: doctorTimeSlot.startAt,
      endAt: doctorTimeSlot.endAt,
      availability: doctorTimeSlot.availability,
      createdAt: doctorTimeSlot.createdAt,
      updatedAt: doctorTimeSlot.updatedAt,
    }
  }
}
