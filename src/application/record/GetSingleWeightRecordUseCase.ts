import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetSingleWeightRecordRequest {
  user: User
  weightRecordId: string
  targetPatientId: string
}

interface GetSingleWeightRecordResponse {
  data: {
    id: string
    weightDate: Date
    weightValueKg: number
    bodyMassIndex: number
    weightNote: string | null
    createdAt: Date
    updatedAt: Date
  }
  recordOwner: IRecordOwner
}

export interface IRecordOwner {
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
}

export interface IWeightRecordWithOwner {
  id: string
  weightDate: Date
  weightValueKg: number
  bodyMassIndex: number
  weightNote: string | null
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleWeightRecordUseCase {
  constructor(
    private readonly weightRecordRepository: IWeightRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetSingleWeightRecordRequest
  ): Promise<GetSingleWeightRecordResponse> {
    const { user, weightRecordId } = request

    const existingRecord = await this.weightRecordRepository.findById(
      weightRecordId
    )
    if (existingRecord == null) {
      throw new NotFoundError('The weight record does not exist.')
    }

    const patientId = existingRecord.patientId

    if (user.role === UserRoleType.DOCTOR) {
      const currentDoctor = await this.doctorRepository.findByUserId(user.id)
      if (currentDoctor == null) {
        throw new AuthorizationError('The currentDoctor does not exist.')
      }
      const upComingAppointments =
        await this.consultAppointmentRepository.findByPatientIdAndDoctorIdAndStatus(
          patientId,
          currentDoctor.id,
          [ConsultAppointmentStatusType.UPCOMING]
        )
      if (upComingAppointments.length === 0) {
        throw new AuthorizationError(
          'The current doctor does not be appointed by this patient.'
        )
      }
      const appointmentPatient = await this.patientRepository.findById(
        patientId
      )
      if (appointmentPatient == null) {
        throw new AuthorizationError(
          'Patient who made the appointment does not exist.'
        )
      }
      return {
        data: {
          id: existingRecord.id,
          weightDate: existingRecord.weightDate,
          weightValueKg: existingRecord.weightValueKg,
          bodyMassIndex: existingRecord.bodyMassIndex,
          weightNote: existingRecord.weightNote,
          createdAt: existingRecord.createdAt,
          updatedAt: existingRecord.updatedAt,
        },
        recordOwner: {
          firstName: appointmentPatient.firstName,
          lastName: appointmentPatient.lastName,
          birthDate: appointmentPatient.birthDate,
          gender: appointmentPatient.gender,
        },
      }
    }

    const currentPatient = await this.patientRepository.findByUserId(user.id)
    if (currentPatient == null) {
      throw new AuthorizationError('The current patient does not exist.')
    }

    const recordWithOwner =
      await this.weightRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        weightRecordId,
        currentPatient.id
      )

    if (recordWithOwner == null) {
      throw new AuthorizationError(
        'The current patient does not have weight record.'
      )
    }
    return {
      data: {
        id: recordWithOwner.id,
        weightDate: recordWithOwner.weightDate,
        weightValueKg: recordWithOwner.weightValueKg,
        bodyMassIndex: recordWithOwner.bodyMassIndex,
        weightNote: recordWithOwner.weightNote,
        createdAt: recordWithOwner.createdAt,
        updatedAt: recordWithOwner.updatedAt,
      },
      recordOwner: {
        firstName: recordWithOwner.patientFirstName,
        lastName: recordWithOwner.patientLastName,
        birthDate: recordWithOwner.patientBirthDate,
        gender: recordWithOwner.patientGender,
      },
    }
  }
}
