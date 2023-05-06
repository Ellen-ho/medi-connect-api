import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import {
  ConsultAppointment,
  ConsultAppointmentStatusType,
} from '../../domain/consultation/ConsultAppointment'
import { DoctorTimeSlot } from '../../domain/consultation/DoctorTimeSlot'

interface CreateConsultAppointmentRequest {
  user: User
  doctorTimeSlotId: string
}

interface CreateConsultAppointmentResponse {
  id: string
  patientId: string
  doctorTimeSlot: DoctorTimeSlot
  status: ConsultAppointmentStatusType
  createdAt: Date
  updatedAt: Date
}

export class CreateConsultAppointmentUseCase {
  consultAppointmentRepository: any
  constructor(
    private readonly doctorTimeSlotRepository: IDoctorTimeSlotRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateConsultAppointmentRequest
  ): Promise<CreateConsultAppointmentResponse> {
    const { user, doctorTimeSlotId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingDoctorTimeSlot = await this.doctorTimeSlotRepository.findById(
      doctorTimeSlotId
    )

    if (existingDoctorTimeSlot == null) {
      throw new Error('Doctor time slot does not exist.')
    }

    const consultAppointment = new ConsultAppointment({
      id: this.uuidService.generateUuid(),
      patientId: existingPatient.id,
      doctorTimeSlot: existingDoctorTimeSlot,
      status: ConsultAppointmentStatusType.UPCOMING,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await this.consultAppointmentRepository.save(consultAppointment)

    return {
      id: consultAppointment.id,
      patientId: existingPatient.id,
      doctorTimeSlot: existingDoctorTimeSlot,
      status: consultAppointment.status,
      createdAt: consultAppointment.createdAt,
      updatedAt: consultAppointment.updatedAt,
    }
  }
}
