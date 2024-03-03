import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarType } from '../../domain/record/BloodSugarRecord'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetBloodSugarRecordsRequest {
  user: User
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  targetPatientId: string
}
interface GetBloodSugarRecordsResponse {
  patientData: {
    firstName: string
    lastName: string
    birthDate: Date
    gender: GenderType
  }
  recordsData: Array<{
    id: string
    date: Date
    bloodSugarValue: number // mg/L
    bloodSugarType: BloodSugarType
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetBloodSugarRecordsUseCase {
  constructor(
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetBloodSugarRecordsRequest
  ): Promise<GetBloodSugarRecordsResponse> {
    const { user, targetPatientId } = request
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)
    const firstDayOfCurrentMonth = dayjs().startOf('month').format('YYYY-MM-DD')

    const lastDayOfCurrentMonth = dayjs().endOf('month').format('YYYY-MM-DD')
    const startDate: string =
      request.startDate != null ? request.startDate : firstDayOfCurrentMonth
    const endDate: string =
      request.endDate != null ? request.endDate : lastDayOfCurrentMonth

    const existingBloodSugarRecords =
      await this.bloodSugarRecordRepository.findByPatientIdAndCountAll(
        targetPatientId,
        limit,
        offset,
        startDate,
        endDate
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
        recordsData: existingBloodSugarRecords.recordsData,
        pagination: getPagination(
          limit,
          page,
          existingBloodSugarRecords.total_counts
        ),
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
      recordsData: existingBloodSugarRecords.recordsData,
      pagination: getPagination(
        limit,
        page,
        existingBloodSugarRecords.total_counts
      ),
    }
  }
}
