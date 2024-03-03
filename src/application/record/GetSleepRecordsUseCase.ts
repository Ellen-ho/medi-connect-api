import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { SleepQualityType } from '../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../domain/record/interfaces/repositories/ISleepRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetSleepRecordsRequest {
  user: User
  page?: string
  limit?: string
  startDate?: string
  endDate?: string
  targetPatientId: string
}
interface GetSleepRecordsResponse {
  patientData: {
    firstName: string
    lastName: string
    birthDate: Date
    gender: GenderType
  }
  recordsData: Array<{
    id: string
    date: Date
    sleepQuality: SleepQualityType
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetSleepRecordsUseCase {
  constructor(
    private readonly sleepRecordRepository: ISleepRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetSleepRecordsRequest
  ): Promise<GetSleepRecordsResponse> {
    const { user, targetPatientId } = request
    const page: number | undefined =
      request.page !== undefined ? Number(request.page) : undefined
    const limit: number | undefined =
      request.limit !== undefined ? Number(request.limit) : undefined
    const offset: number | undefined = getOffset(limit, page)

    const firstDayOfCurrentMonth = dayjs().startOf('month').format('YYYY-MM-DD')

    const lastDayOfCurrentMonth = dayjs().endOf('month').format('YYYY-MM-DD')
    const startDate: string =
      request.startDate != null ? request.startDate : firstDayOfCurrentMonth
    const endDate: string =
      request.endDate != null ? request.endDate : lastDayOfCurrentMonth

    const existingSleepRecords =
      await this.sleepRecordRepository.findByPatientIdAndCountAll(
        targetPatientId,
        limit,
        offset,
        startDate,
        endDate
      )

    if (existingSleepRecords.recordsData.length === 0) {
      throw new NotFoundError('No sleep record exists.')
    }

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
        recordsData: existingSleepRecords.recordsData,
        pagination: getPagination(
          limit,
          page,
          existingSleepRecords.total_counts
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
      recordsData: existingSleepRecords.recordsData,
      pagination: getPagination(limit, page, existingSleepRecords.total_counts),
    }
  }
}
