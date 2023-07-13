import { DoctorTimeSlot } from '../../DoctorTimeSlot'

export interface IDoctorTimeSlotRepository {
  findById: (id: string) => Promise<DoctorTimeSlot | null>
  findByIdAndDoctorId: (
    id: string,
    doctorId: string
  ) => Promise<DoctorTimeSlot | null>
  findByStartAtAndDoctorId: (
    startAt: Date,
    doctorId: string
  ) => Promise<DoctorTimeSlot | null>
  save: (doctorTimeSlot: DoctorTimeSlot) => Promise<void>
}
