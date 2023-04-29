import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateConsultAppointmentRequest {
  user: User
  patientId: string
  doctorStatus: DoctorStatusType
  patientStatus: PatientStatusType
}

interface CreateConsultAppointmentResponse {
  id: string
  patientId: string
  doctorTimeSlotId: string
  doctorStatus: DoctorStatusType
  patientStatus: PatientStatusType
  createdAt: Date
  updatedAt: Date
}

export class CreateConsultAppointmentUseCase {
  constructor(
    private readonly doctorTimeSlotRepository: IDoctorTimeSlotRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateConsultAppointmentRequest
  ): Promise<CreateConsultAppointmentResponse> {
    const { user, patientId, doctorStatus, patientStatus } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingDoctorTimeSlot = await this.doctorTimeSlotRepository.findById(
      doctorTimeSlot.id
    )

    if (existingDoctorTimeSlot == null) {
      throw new Error('Doctor time slot does not exist.')
    }

    const consultAppointment = new ConsultAppointment({
      id: this.uuidService.generateUuid(),
      patientId,
      doctorTimeSlotId,
      doctorStatus,
      patientStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await this.consultAppointmentRepository.save(consultAppointment)

    return {
      id: consultAppointment.id,
      patientId: consultAppointment.patient.id,
      doctorTimeSlotId: consultAppointment.doctorTimeSlot.id,
      doctorStatus,
      patientStatus,
      createdAt: consultAppointment.createdAt,
      updatedAt: consultAppointment.updatedAt,
    }
  }
}
