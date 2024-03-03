import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IGlycatedHemoglobinRecordRepository } from '../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetGlycatedHemoglobinRecordsRequest {
  user: User
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  targetPatientId: string
}
interface GetGlycatedHemoglobinRecordsResponse {
  patientData: {
    firstName: string
    lastName: string
    birthDate: Date
    gender: GenderType
  }
  recordsData: Array<{
    id: string
    date: Date
    glycatedHemoglobinValuePercent: number
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetGlycatedHemoglobinRecordsUseCase {
  constructor(
    private readonly glycatedHemoglobinRecordRepository: IGlycatedHemoglobinRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetGlycatedHemoglobinRecordsRequest
  ): Promise<GetGlycatedHemoglobinRecordsResponse> {
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

    const existingGlycatedHemoglobinRecords =
      await this.glycatedHemoglobinRecordRepository.findByPatientIdAndCountAll(
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
        recordsData: existingGlycatedHemoglobinRecords.recordsData,
        pagination: getPagination(
          limit,
          page,
          existingGlycatedHemoglobinRecords.total_counts
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
      recordsData: existingGlycatedHemoglobinRecords.recordsData,
      pagination: getPagination(
        limit,
        page,
        existingGlycatedHemoglobinRecords.total_counts
      ),
    }
  }
}
