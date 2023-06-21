import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import {
  HealthGoalStatus,
  IBloodPressureValue,
  IHealthGoalResult,
} from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { IWeightRecordRepository } from '../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'
interface GetHealthGoalRequest {
  healthGoalId: string
  user: User
}

interface GetHealthGoalResponse {
  id: string
  bloodPressureCurrentValue: IBloodPressureValue | null
  bloodPressureTargetValue: IBloodPressureValue
  bloodSugarCurrentValue: number | null
  bloodSugarCurrentType: BloodSugarType | null
  bloodSugarTargetValue: number
  bloodSugarTargetType: BloodSugarType
  glycatedHemonglobinCurrentValue: number | null
  glycatedHemonglobinTargetValue: number
  weightCurrentValue: number | null
  weightTargetValue: number
  bodyMassIndexCurrentValue: number | null
  bodyMassIndexTargetValue: number
  startAt: Date
  endAt: Date
  status: HealthGoalStatus
  result: IHealthGoalResult | null
  createdAt: Date
  updatedAt: Date
}
export class GetHealthGoalUseCase {
  constructor(
    private readonly healthGoalRepository: IHealthGoalRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly glycatedHemonglobinRecordRepository: IGlycatedHemoglobinRecordRepository,
    private readonly weightRecordRepository: IWeightRecordRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetHealthGoalRequest
  ): Promise<GetHealthGoalResponse | null> {
    const { user, healthGoalId } = request

    const existingHealthGoal = await this.healthGoalRepository.findById(
      healthGoalId
    )

    if (existingHealthGoal === null) {
      throw new NotFoundError('HealthGoal does not exist.')
    }

    if (
      existingHealthGoal.status === 'REJECTED' ||
      existingHealthGoal.status === 'PENDING'
    ) {
      throw new ValidationError(
        'The health goal becomes invalid after being rejected by the patient or can not be accessed when being pending.'
      )
    }

    const latestBloodPressureRecord =
      await this.bloodPressureRecordRepository.findByPatientIdAndDate(
        existingHealthGoal.patientId,
        new Date()
      )

    const latestBloodSugarRecord =
      await this.bloodSugarRecordRepository.findByPatientIdAndDate(
        existingHealthGoal.patientId,
        new Date()
      )

    const latestGlycatedHemonglobinRecord =
      await this.glycatedHemonglobinRecordRepository.findByPatientIdAndDate(
        existingHealthGoal.patientId,
        new Date()
      )

    const latestWeightRecord =
      await this.weightRecordRepository.findByPatientIdAndDate(
        existingHealthGoal.patientId,
        new Date()
      )

    const latestBodyMassIndexRecord =
      await this.weightRecordRepository.findByPatientIdAndDate(
        existingHealthGoal.patientId,
        new Date()
      )

    // 若登入者為doctor
    if (user.role === UserRoleType.DOCTOR) {
      const currentDoctor = await this.doctorRepository.findByUserId(user.id)
      if (currentDoctor == null) {
        throw new AuthorizationError('The currentDoctor does not exist.')
      }
      const upComingAppointments =
        await this.consultAppointmentRepository.findByPatientIdAndDoctorIdAndStatus(
          existingHealthGoal.patientId, // 紀錄的擁有患者
          currentDoctor.id, // 當前登入的醫師
          [ConsultAppointmentStatusType.UPCOMING] // 預約狀態為upComing的期間
        )
      if (upComingAppointments.length === 0) {
        throw new AuthorizationError(
          'The current doctor does not be appointed by this patient.'
        )
      }
      const appointmentPatient = await this.patientRepository.findById(
        existingHealthGoal.patientId
      )
      if (appointmentPatient == null) {
        throw new AuthorizationError(
          'Patient who made the appointment does not exist.'
        )
      }
    }

    // 若登入者身分為患者
    if (user.role === UserRoleType.PATIENT) {
      const currentPatient = await this.patientRepository.findByUserId(user.id)
      if (currentPatient == null) {
        throw new AuthorizationError('The current patient does not exist.')
      }
      if (currentPatient.id !== existingHealthGoal.patientId) {
        throw new AuthorizationError(
          'The health goal does not belong to the current patient.'
        )
      }
    }
    return {
      id: existingHealthGoal.id,
      bloodPressureCurrentValue:
        latestBloodPressureRecord !== null
          ? {
              systolicBloodPressure:
                latestBloodPressureRecord.systolicBloodPressure,
              diastolicBloodPressure:
                latestBloodPressureRecord.diastolicBloodPressure,
            }
          : null,
      bloodPressureTargetValue: existingHealthGoal.bloodPressureTargetValue,
      bloodSugarCurrentValue:
        latestBloodSugarRecord !== null
          ? latestBloodSugarRecord.bloodSugarValue
          : null,
      bloodSugarCurrentType:
        latestBloodSugarRecord !== null
          ? latestBloodSugarRecord.bloodSugarType
          : null,
      bloodSugarTargetValue: existingHealthGoal.bloodSugarTargetValue,
      bloodSugarTargetType: existingHealthGoal.bloodSugarTargetType,
      glycatedHemonglobinCurrentValue:
        latestGlycatedHemonglobinRecord !== null
          ? latestGlycatedHemonglobinRecord.glycatedHemoglobinValuePercent
          : null,
      glycatedHemonglobinTargetValue:
        existingHealthGoal.glycatedHemonglobinTargetValue,
      weightCurrentValue:
        latestWeightRecord !== null ? latestWeightRecord.weightValueKg : null,
      weightTargetValue: existingHealthGoal.weightTargetValue,
      bodyMassIndexCurrentValue:
        latestBodyMassIndexRecord !== null
          ? latestBodyMassIndexRecord.bodyMassIndex
          : null,
      bodyMassIndexTargetValue: existingHealthGoal.bodyMassIndexTargetValue,
      startAt: existingHealthGoal.startAt,
      result: existingHealthGoal.result,
      endAt: existingHealthGoal.endAt,
      status: existingHealthGoal.status,
      createdAt: existingHealthGoal.createdAt,
      updatedAt: existingHealthGoal.updatedAt,
    }
  }
}
