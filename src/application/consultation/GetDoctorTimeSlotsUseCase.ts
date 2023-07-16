import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetDoctorTimeSlotsRequest {
  doctorId: string
  starAt?: Date
  endAt?: Date
}

interface GetDoctorTimeSlotsResponse {
  doctorId: string
  timeSlots: Array<{
    id: string
    startAt: Date
    endAt: Date
    isAvailable: boolean
  }>
}

export class GetDoctorTimeSlotsUseCase {
  constructor(
    private readonly doctorTimeSlotRepository: IDoctorTimeSlotRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: GetDoctorTimeSlotsRequest
  ): Promise<GetDoctorTimeSlotsResponse> {
    const { doctorId } = request

    const existingDoctor = await this.doctorRepository.findById(doctorId)

    if (existingDoctor == null) {
      throw new NotFoundError('Doctor does not exist.')
    }

    const existingTimeSlots =
      await this.doctorTimeSlotRepository.findByDoctorId(doctorId)

    return {
      doctorId: existingTimeSlots.doctorId,
      timeSlots: existingTimeSlots.timeSlots,
    }
  }
}
