import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { User, UserRoleType } from '../../domain/user/User'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'

interface GetGoalDurationRecordsRequest {
  user: User
  targetPatientId: string
  goalId: string
}
interface GetGoalDurationRecordsResponse {
  patientData: {
    firstName: string
    lastName: string
    birthDate: Date
    gender: GenderType
  }
  bloodPressureRecordsData:
    | Array<{
        id: string
        systolicBloodPressure: number
        diastolicBloodPressure: number
        bloodPressureDate: string
      }>
    | []
  bloodSugarRecordsData:
    | Array<{
        id: string
        bloodSugarValue: number
        bloodSugarDate: string
      }>
    | []
  glycatedHemoglobinRecordsData:
    | Array<{
        id: string
        glycatedHemoglobinValuePercent: number
        glycatedHemoglobinDate: string
      }>
    | []
  weightRecordsData:
    | Array<{
        id: string
        weightValueKg: number
        bodyMassIndex: number
        weightDate: string
      }>
    | []
}
export class GetGoalDurationRecordsUseCase {
  constructor(
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly glycatedHemoglobinRecordRepository: IGlycatedHemoglobinRecordRepository,
    private readonly weightRecordRepository: IWeightRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly healthGoalRepository: IHealthGoalRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetGoalDurationRecordsRequest
  ): Promise<GetGoalDurationRecordsResponse> {
    const { user, targetPatientId, goalId } = request

    const targetGoal = await this.healthGoalRepository.findById(goalId)

    if (targetGoal == null) {
      throw new NotFoundError('The health goal does not exist.')
    }

    const bloodPressureRecordsData =
      await this.bloodPressureRecordRepository.findByGoalDurationDays(
        targetPatientId,
        targetGoal.startAt,
        targetGoal.endAt
      )

    const bloodSugarRecordsData =
      await this.bloodSugarRecordRepository.findByGoalDurationDays(
        targetPatientId,
        targetGoal.startAt,
        targetGoal.endAt
      )

    const weightRecordsData =
      await this.weightRecordRepository.findByGoalDurationDays(
        targetPatientId,
        targetGoal.startAt,
        targetGoal.endAt
      )

    const glycatedHemoglobinRecordsData =
      await this.glycatedHemoglobinRecordRepository.findByGoalDurationDays(
        targetPatientId,
        targetGoal.startAt,
        targetGoal.endAt
      )

    if (user.role === UserRoleType.DOCTOR) {
      const currentDoctor = await this.doctorRepository.findByUserId(user.id)
      if (currentDoctor == null) {
        throw new AuthorizationError('The currentDoctor does not exist.')
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
        patientData: {
          firstName: appointmentPatient.firstName,
          lastName: appointmentPatient.lastName,
          birthDate: appointmentPatient.birthDate,
          gender: appointmentPatient.gender,
        },
        bloodPressureRecordsData,
        bloodSugarRecordsData,
        glycatedHemoglobinRecordsData,
        weightRecordsData,
      }
    }

    const currentPatient = await this.patientRepository.findByUserId(user.id)
    if (currentPatient == null) {
      throw new AuthorizationError('The current patient does not exist.')
    }

    if (currentPatient.id !== targetPatientId) {
      throw new AuthorizationError(
        'These records do not belong to the current patient.'
      )
    }
    return {
      patientData: {
        firstName: currentPatient.firstName,
        lastName: currentPatient.lastName,
        birthDate: currentPatient.birthDate,
        gender: currentPatient.gender,
      },
      bloodPressureRecordsData,
      bloodSugarRecordsData,
      glycatedHemoglobinRecordsData,
      weightRecordsData,
    }
  }
}
