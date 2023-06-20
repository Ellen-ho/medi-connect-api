import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import {
  HealthGoalStatus,
  IHealthGoalResult,
} from '../../domain/goal/HealthGoal'
import { IHealthGoalRepository } from '../../domain/goal/interfaces/repositories/IHealthGoalRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetHealthGoalListRequest {
  user: User
  page?: number
  limit?: number
  targetPatientId: string // validator檢查為必填
}

interface GetHealthGoalListResponse {
  patientData: {
    firstName: string
    lastName: string
    birthDate: Date
    gender: GenderType
  }
  goalsData: Array<{
    startAt: Date
    endAt: Date
    status: HealthGoalStatus
    result: IHealthGoalResult | null
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}

export class GetHealthGoalListUseCase {
  constructor(
    private readonly healthGoalRepository: IHealthGoalRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetHealthGoalListRequest
  ): Promise<GetHealthGoalListResponse | null> {
    const { user, targetPatientId } = request
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingHealthGoals =
      await this.healthGoalRepository.findByPatientIdAndCountAll(
        targetPatientId,
        limit,
        offset
      )

    if (existingHealthGoals.goalsData.length === 0) {
      throw new NotFoundError('No record exists.')
    }

    const filteredGoalsData = existingHealthGoals.goalsData.filter(
      (goal) => goal.status !== 'REJECTED' && goal.status !== 'PENDING'
    )

    if (user.role === UserRoleType.DOCTOR) {
      // 若登入者為doctor
      const currentDoctor = await this.doctorRepository.findByUserId(user.id)
      if (currentDoctor == null) {
        throw new AuthorizationError('The currentDoctor does not exist.')
      }
      const upComingAppointments =
        await this.consultAppointmentRepository.findByPatientIdAndDoctorIdAndStatus(
          targetPatientId, // 紀錄的擁有患者
          currentDoctor.id, // 當前登入的醫師
          [ConsultAppointmentStatusType.UPCOMING] // 預約狀態為upComing
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
        goalsData: filteredGoalsData,
        pagination: getPagination(
          limit,
          page,
          existingHealthGoals.total_counts
        ),
      }
    }

    // 若登入者身分為患者
    const currentPatient = await this.patientRepository.findByUserId(user.id)
    if (currentPatient == null) {
      throw new AuthorizationError('The current patient does not exist.')
    }
    if (currentPatient.id !== targetPatientId) {
      throw new AuthorizationError(
        'These health goals do not belong to the current patient.'
      )
    }
    return {
      patientData: {
        firstName: currentPatient.firstName,
        lastName: currentPatient.lastName,
        birthDate: currentPatient.birthDate,
        gender: currentPatient.gender,
      },
      goalsData: filteredGoalsData,
      pagination: getPagination(limit, page, existingHealthGoals.total_counts),
    }
  }
}
