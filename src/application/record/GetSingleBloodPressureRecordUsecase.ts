import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import dayjs from 'dayjs'

export interface GetSingleBloodPressureRecordRequest {
  user: User
  bloodPressureRecordId: string
  targetPatientId: string
}

interface GetSingleBloodPressureRecordResponse {
  data: {
    id: string
    bloodPressureDate: Date
    systolicBloodPressure: number
    diastolicBloodPressure: number
    heartBeat: number
    bloodPressureNote: string | null
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

export interface IBloodPressureRecordWithOwner {
  id: string
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleBloodPressureRecordUseCase {
  constructor(
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetSingleBloodPressureRecordRequest
  ): Promise<GetSingleBloodPressureRecordResponse> {
    const { user, bloodPressureRecordId } = request

    const existingRecord = await this.bloodPressureRecordRepository.findById(
      bloodPressureRecordId
    )
    if (existingRecord == null) {
      throw new NotFoundError('The blood pressure record does not exist.')
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

      const bloodPressureDateUTC8 = dayjs(existingRecord.bloodPressureDate)
        .add(8, 'hour')
        .toDate()

      return {
        data: {
          id: existingRecord.id,
          bloodPressureDate: bloodPressureDateUTC8,
          systolicBloodPressure: existingRecord.systolicBloodPressure,
          diastolicBloodPressure: existingRecord.diastolicBloodPressure,
          heartBeat: existingRecord.heartBeat,
          bloodPressureNote: existingRecord.bloodPressureNote,
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
      await this.bloodPressureRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        bloodPressureRecordId,
        currentPatient.id
      )

    if (recordWithOwner == null) {
      throw new AuthorizationError(
        'The record does not belong to the current patient.'
      )
    }

    const bloodPressureDateUTC8 = dayjs(recordWithOwner.bloodPressureDate)
      .add(8, 'hour')
      .toDate()

    return {
      data: {
        id: recordWithOwner.id,
        bloodPressureDate: bloodPressureDateUTC8,
        systolicBloodPressure: recordWithOwner.systolicBloodPressure,
        diastolicBloodPressure: recordWithOwner.diastolicBloodPressure,
        heartBeat: recordWithOwner.heartBeat,
        bloodPressureNote: recordWithOwner.bloodPressureNote,
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
