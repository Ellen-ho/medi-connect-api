import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { ExerciseType } from '../../domain/record/ExerciseRecord'
import { IExerciseRecordRepository } from '../../domain/record/interfaces/repositories/IExerciseRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { getOffset, getPagination } from '../../infrastructure/utils/Pagination'

interface GetExerciseRecordsRequest {
  user: User
  page?: number
  limit?: number
  targetPatientId: string
}
interface GetExerciseRecordsResponse {
  patientData: {
    firstName: string
    lastName: string
    birthDate: Date
    gender: GenderType
  }
  recordsData: Array<{
    exerciseDate: Date
    exerciseType: ExerciseType
  }>
  pagination: {
    pages: number[]
    totalPage: number
    currentPage: number
    prev: number
    next: number
  }
}
export class GetExerciseRecordsUseCase {
  constructor(
    private readonly exerciseRecordRepository: IExerciseRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetExerciseRecordsRequest
  ): Promise<GetExerciseRecordsResponse> {
    const { user, targetPatientId } = request
    const page: number = request.page != null ? request.page : 1
    const limit: number = request.limit != null ? request.limit : 10
    const offset: number = getOffset(limit, page)

    const existingExerciseRecords =
      await this.exerciseRecordRepository.findByPatientIdAndCountAll(
        targetPatientId,
        limit,
        offset
      )

    if (existingExerciseRecords.recordsData.length === 0) {
      throw new Error('No record exists.')
    }
    // 若登入者為doctor
    if (user.role === UserRoleType.DOCTOR) {
      const currentDoctor = await this.doctorRepository.findByUserId(user.id)
      if (currentDoctor == null) {
        throw new Error('The currentDoctor does not exist.')
      }
      const upComingAppointments =
        await this.consultAppointmentRepository.findByPatientIdAndDoctorIdAndStatus(
          targetPatientId, // 紀錄的擁有患者
          currentDoctor.id, // 當前登入的醫師
          [ConsultAppointmentStatusType.UPCOMING] // 預約狀態為upComing
        )
      if (upComingAppointments.length === 0) {
        throw new Error(
          'The current doctor does not be appointed by this patient.'
        )
      }
      const appointmentPatient = await this.patientRepository.findById(
        targetPatientId
      )
      if (appointmentPatient == null) {
        throw new Error('Patient who made the appointment does not exist.')
      }

      return {
        patientData: {
          firstName: appointmentPatient.firstName,
          lastName: appointmentPatient.lastName,
          birthDate: appointmentPatient.birthDate,
          gender: appointmentPatient.gender,
        },
        recordsData: existingExerciseRecords.recordsData,
        pagination: getPagination(
          limit,
          page,
          existingExerciseRecords.total_counts
        ),
      }
    }
    // 若登入者身分為患者
    const currentPatient = await this.patientRepository.findByUserId(user.id)
    if (currentPatient == null) {
      throw new Error('The current patient does not exist.')
    }
    // 判斷此record是否屬於當前登入的患者
    if (currentPatient.id !== targetPatientId) {
      throw new Error('These records do not belong to the current patient.')
    }

    return {
      patientData: {
        firstName: currentPatient.firstName,
        lastName: currentPatient.lastName,
        birthDate: currentPatient.birthDate,
        gender: currentPatient.gender,
      },
      recordsData: existingExerciseRecords.recordsData,
      pagination: getPagination(
        limit,
        page,
        existingExerciseRecords.total_counts
      ),
    }
  }
}
