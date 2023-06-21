import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'

interface GetSingleBloodPressureRecordRequest {
  user: User
  bloodPressureRecordId: string
}

interface GetSingleBloodPressureRecordResponse {
  data: {
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

    // 若登入者為doctor
    if (user.role === UserRoleType.DOCTOR) {
      const currentDoctor = await this.doctorRepository.findByUserId(user.id)
      if (currentDoctor == null) {
        throw new AuthorizationError('The currentDoctor does not exist.')
      }
      const upComingAppointments =
        await this.consultAppointmentRepository.findByPatientIdAndDoctorIdAndStatus(
          patientId, // 該紀錄的擁有患者
          currentDoctor.id, // 當前登入的醫師
          [ConsultAppointmentStatusType.UPCOMING] // 預約狀態為upComing
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
          bloodPressureDate: existingRecord.bloodPressureDate,
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

    // 若登入者身分為患者
    const currentPatient = await this.patientRepository.findByUserId(user.id)
    if (currentPatient == null) {
      throw new AuthorizationError('The current patient does not exist.')
    }
    // 判斷此record是否屬於當前登入的患者
    const recordWithOwner =
      await this.bloodPressureRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        bloodPressureRecordId,
        currentPatient.id // 當前登入的patient
      )

    if (recordWithOwner == null) {
      throw new AuthorizationError(
        'The record does not belong to the current patient.'
      )
    }

    return {
      data: {
        bloodPressureDate: recordWithOwner.bloodPressureDate,
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
