import { MedicalSpecialtyType } from '../../../question/PatientQuestion'
import {
  ConsultAppointment,
  ConsultAppointmentStatusType,
} from '../../ConsultAppointment'

export interface IConsultAppointmentRepository {
  findById: (id: string) => Promise<ConsultAppointment | null>
  findByIdAndPatientId: (
    consultAppointmentId: string,
    patientId: string
  ) => Promise<ConsultAppointment | null>
  findByPatientIdAndDate: (
    patientId: string,
    currentDate: Date
  ) => Promise<ConsultAppointment | null>
  deleteById: (id: string) => Promise<void>
  save: (consultAppointment: ConsultAppointment) => Promise<void>
  findByPatientIdAndStatusWithinDateRange: (
    patientId: string,
    status: ConsultAppointmentStatusType[],
    startDate: Date,
    endDate: Date
  ) => Promise<
    Array<{
      patientId: string
      status: ConsultAppointmentStatusType
      doctorTimeSlot: {
        startAt: Date
        endAt: Date
      }
      doctor: {
        firstName: string
        lastName: string
        specialties: MedicalSpecialtyType[]
      }
    }>
  >
  findByDoctorIdAndStatusWithinDateRange: (
    doctorId: string,
    status: ConsultAppointmentStatusType[],
    startDate: Date,
    endDate: Date
  ) => Promise<
    Array<{
      status: ConsultAppointmentStatusType
      doctorTimeSlot: {
        doctorId: string
        startAt: Date
        endAt: Date
      }
      patient: {
        firstName: string
        lastName: string
      }
    }>
  >
  findByPatientIdAndDoctorIdAndStatus: (
    patientId: string,
    doctorId: string,
    status: ConsultAppointmentStatusType[]
  ) => Promise<ConsultAppointment[]>
}
