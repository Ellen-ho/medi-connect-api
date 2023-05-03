import { ConsultAppointment } from '../../ConsultAppointment'

export interface IConsultAppointmentRepository {
  findById: (id: string) => Promise<ConsultAppointment | null>

  save: (consultAppointment: ConsultAppointment) => Promise<void>
}
