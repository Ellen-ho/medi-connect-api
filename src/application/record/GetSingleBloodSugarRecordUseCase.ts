import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetSingleBloodSugarRecordRequest {
  user: User
  bloodSugarRecordId: string
}

interface GetSingleBloodSugarRecordResponse {
  data: {
    bloodSugarDate: Date
    bloodSugarValue: number
    bloodSugarType: BloodSugarType
    bloodSugarNote: string | null
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

export interface IBloodSugarRecordWithOwner {
  id: string
  bloodSugarDate: Date
  bloodSugarValue: number
  bloodSugarType: BloodSugarType
  bloodSugarNote: string | null
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleBloodSugarRecordUseCase {
  constructor(
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetSingleBloodSugarRecordRequest
  ): Promise<GetSingleBloodSugarRecordResponse> {
    const { user, bloodSugarRecordId } = request

    const existingRecord = await this.bloodSugarRecordRepository.findById(
      bloodSugarRecordId
    )
    if (existingRecord == null) {
      throw new NotFoundError('The blood sugar record does not exist.')
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
          bloodSugarDate: existingRecord.bloodSugarDate,
          bloodSugarValue: existingRecord.bloodSugarValue,
          bloodSugarType: existingRecord.bloodSugarType,
          bloodSugarNote: existingRecord.bloodSugarNote,
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
      await this.bloodSugarRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        bloodSugarRecordId,
        currentPatient.id // 當前登入的patient
      )

    if (recordWithOwner == null) {
      throw new AuthorizationError(
        'The current patient does not have blood sugar record.'
      )
    }

    return {
      data: {
        bloodSugarDate: recordWithOwner.bloodSugarDate,
        bloodSugarValue: recordWithOwner.bloodSugarValue,
        bloodSugarType: recordWithOwner.bloodSugarType,
        bloodSugarNote: recordWithOwner.bloodSugarNote,
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
