import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import {
  GenderType,
  IAllergy,
  IFamilyHistoryItem,
  IMedicalHistoryItem,
  IMedicineUsageItem,
} from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'

interface GetPatientProfileRequest {
  user: User
  targetPatientId: string
}

interface GetPatientProfileResponse {
  id: string
  avatar: string | null
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
  medicalHistory: IMedicalHistoryItem[] | null
  allergy: IAllergy
  familyHistory: IFamilyHistoryItem[] | null
  heightValueCm: number
  medicineUsage: IMedicineUsageItem[] | null
  createdAt: Date
  updatedAt: Date
}

export class GetPatientProfileUseCase {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetPatientProfileRequest
  ): Promise<GetPatientProfileResponse> {
    const { user, targetPatientId } = request
    if (user.role === UserRoleType.DOCTOR) {
      const currentDoctor = await this.doctorRepository.findByUserId(user.id)
      if (currentDoctor == null) {
        throw new AuthorizationError('The current Doctor does not exist.')
      }
      const upComingAppointments =
        await this.consultAppointmentRepository.findByPatientIdAndDoctorIdAndStatus(
          targetPatientId,
          currentDoctor.id,
          [ConsultAppointmentStatusType.UPCOMING]
        )
      if (upComingAppointments.length === 0) {
        throw new AuthorizationError(
          'The current doctor does not be appointed by this patient.'
        )
      }
      const appointmentPatient = await this.patientRepository.findById(
        targetPatientId
      )
      if (appointmentPatient == null) {
        throw new AuthorizationError(
          'Patient who made the appointment does not exist.'
        )
      }

      return {
        id: appointmentPatient.id,
        avatar: appointmentPatient.avatar,
        firstName: appointmentPatient.firstName,
        lastName: appointmentPatient.lastName,
        birthDate: appointmentPatient.birthDate,
        gender: appointmentPatient.gender,
        medicalHistory: appointmentPatient.medicalHistory,
        allergy: appointmentPatient.allergy,
        familyHistory: appointmentPatient.familyHistory,
        heightValueCm: appointmentPatient.heightValueCm,
        medicineUsage: appointmentPatient.medicineUsage,
        createdAt: appointmentPatient.createdAt,
        updatedAt: appointmentPatient.updatedAt,
      }
    }

    const currentPatient = await this.patientRepository.findByUserId(user.id)
    if (currentPatient == null) {
      return {
        id: '',
        avatar: null,
        firstName: '',
        lastName: '',
        birthDate: new Date(),
        gender: GenderType.FEMALE,
        medicalHistory: null,
        allergy: {
          medicine: null,
          food: null,
          other: null,
        },
        familyHistory: null,
        heightValueCm: 0,
        medicineUsage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    if (currentPatient.id !== targetPatientId) {
      throw new AuthorizationError(
        'These records do not belong to the current patient.'
      )
    }

    return {
      id: currentPatient.id,
      avatar: currentPatient.avatar,
      firstName: currentPatient.firstName,
      lastName: currentPatient.lastName,
      birthDate: currentPatient.birthDate,
      gender: currentPatient.gender,
      medicalHistory: currentPatient.medicalHistory,
      allergy: currentPatient.allergy,
      familyHistory: currentPatient.familyHistory,
      heightValueCm: currentPatient.heightValueCm,
      medicineUsage: currentPatient.medicineUsage,
      createdAt: currentPatient.createdAt,
      updatedAt: currentPatient.updatedAt,
    }
  }
}
