import { DoctorTimeSlot } from '../../DoctorTimeSlot'

export interface IDoctorTimeSlotRepository {
  findById: (id: string) => Promise<DoctorTimeSlot | null>

  save: (doctorTimeSlot: DoctorTimeSlot) => Promise<void>
}
