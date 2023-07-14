import { MedicalSpecialtyType } from '../../../question/PatientQuestion'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { IExecutor } from '../../../shared/IRepositoryTx'
import {
  ConsultAppointment,
  ConsultAppointmentStatusType,
} from '../../ConsultAppointment'

export interface IConsultAppointmentRepository
  extends IBaseRepository<ConsultAppointment> {
  findById: (id: string) => Promise<ConsultAppointment | null>
  findByIdAndPatientId: (
    consultAppointmentId: string,
    patientId: string
  ) => Promise<ConsultAppointment | null>
  deleteById: (id: string, executo?: IExecutor) => Promise<void>
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
      meetingLink: string | null
      cacelAvailability: boolean
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
      meetingLink: string | null
    }>
  >
  findByPatientIdAndDoctorIdAndStatus: (
    patientId: string,
    doctorId: string,
    status: ConsultAppointmentStatusType[]
  ) => Promise<ConsultAppointment[]>
}
