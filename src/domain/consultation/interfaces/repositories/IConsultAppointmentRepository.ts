import { ConsultAppointment } from '../../ConsultAppointment'

export interface IConsultAppointmentRepository {
  findById: (id: string) => Promise<ConsultAppointment | null>
  findByIdAndPatientId: (
    consultAppointmentId: string,
    patientId: string
  ) => Promise<ConsultAppointment | null>
  deleteById: (id: string) => Promise<void>
  save: (consultAppointment: ConsultAppointment) => Promise<void>
}
