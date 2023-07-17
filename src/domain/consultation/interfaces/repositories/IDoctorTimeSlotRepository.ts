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
  findByDoctorIdAndDate: (
    doctorId: string,
    startTime: string,
    endTime: string
  ) => Promise<{
    doctorId: string
    timeSlots: Array<{
      id: string
      startAt: Date
      endAt: Date
      isAvailable: boolean
    }>
  }>
}
