import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'

interface CancelConsultAppointmentRequest {
  user: User
  consultAppointmentId: string
}

interface CancelConsultAppointmentResponse {
  consultAppointmentId: string
  status: ConsultAppointmentStatusType
}

export class ConsultAppointmentUseCase {
  constructor(
    private readonly consultAppointmentRepository: IConsultAppointmentRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: CancelConsultAppointmentRequest
  ): Promise<CancelConsultAppointmentResponse> {
    const { user, consultAppointmentId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingConsultAppointment =
      await this.consultAppointmentRepository.findByIdAndPatientId(
        consultAppointmentId,
        existingPatient.id
      )
    if (existingConsultAppointment == null) {
      throw new Error('Consult appointment does not exist.')
    }

    await this.consultAppointmentRepository.deleteById(
      existingConsultAppointment.id
    )

    return {
      consultAppointmentId,
      status: ConsultAppointmentStatusType.PATIENT_CANCELED,
    }
  }
}
