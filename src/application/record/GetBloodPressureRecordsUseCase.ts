import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import {
  getPagination,
  getRecordOffset,
} from '../../infrastructure/utils/Pagination'

interface GetBloodPressureRecordsRequest {
  user: User
  page?: string
  limit?: string
  startDate?: string
  endDate?: string
  targetPatientId: string
}
interface GetBloodPressureRecordsResponse {
  patientData: {
    firstName: string
    lastName: string
    birthDate: Date
    gender: GenderType
  }
  recordsData: Array<{
    id: string
    date: Date
    systolicBloodPressure: number
    diastolicBloodPressure: number
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetBloodPressureRecordsUseCase {
  constructor(
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetBloodPressureRecordsRequest
  ): Promise<GetBloodPressureRecordsResponse> {
    const { user, targetPatientId } = request
    const page: number | undefined =
      request.page !== undefined ? Number(request.page) : undefined
    const limit: number | undefined =
      request.limit !== undefined ? Number(request.limit) : undefined
    const offset: number | undefined = getRecordOffset(limit, page)
    const firstDayOfCurrentMonth = dayjs().startOf('month').format('YYYY-MM-DD')

    const lastDayOfCurrentMonth = dayjs().endOf('month').format('YYYY-MM-DD')

    const startDate: string =
      request.startDate != null
        ? dayjs(request.startDate).format('YYYY-MM-DD')
        : dayjs(firstDayOfCurrentMonth).format('YYYY-MM-DD')

    const endDate: string =
      request.endDate != null
        ? dayjs(request.endDate).format('YYYY-MM-DD')
        : dayjs(lastDayOfCurrentMonth).format('YYYY-MM-DD')

    console.log(startDate)
    console.log(endDate)

    const existingBloodPressureRecords =
      await this.bloodPressureRecordRepository.findByPatientIdAndCountAll(
        targetPatientId,
        startDate,
        endDate,
        offset,
        limit
      )

    console.log(existingBloodPressureRecords)

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
        recordsData: existingBloodPressureRecords.recordsData,
        pagination: getPagination(
          limit,
          page,
          existingBloodPressureRecords.total_counts
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
      recordsData: existingBloodPressureRecords.recordsData,
      pagination: getPagination(
        limit,
        page,
        existingBloodPressureRecords.total_counts
      ),
    }
  }
}
