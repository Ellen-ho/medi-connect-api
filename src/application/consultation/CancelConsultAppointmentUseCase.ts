import { User } from '../../domain/user/User'

interface ConsultAppointmentRequest {
  user: User
  consultAppointmentId: string
}

interface ConsultAppointmentResponse {}

export class ConsultAppointmentUseCase {
  constructor(
    private readonly consultAppointmentRepository: IConsultAppointmentRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: CancelConsultAppointmentRequest
  ): Promise<CancelConsultAppointmentResponse> {
    const { user, consultAppointmentId } = request

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const existingConsultAppointment =
      await this.consultAppointmentRepository.findByIdAndAgreedDoctorId(
        consultAppointmentId,
        existingDoctor.id
      )
    if (existingConsultAppointment == null) {
      throw new Error('Consult appointment does not exist.')
    }

    await this.consultAppointmentRepository.deleteById(
      existingConsultAppointment.id
    )

    return {}
  }
}
