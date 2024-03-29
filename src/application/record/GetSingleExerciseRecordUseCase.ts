import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { ExerciseType, IntensityType } from '../../domain/record/ExerciseRecord'
import { IExerciseRecordRepository } from '../../domain/record/interfaces/repositories/IExerciseRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetSingleExerciseRecordRequest {
  user: User
  exerciseRecordId: string
  targetPatientId: string
}

interface GetSingleExerciseRecordResponse {
  data: {
    id: string
    exerciseDate: Date
    exerciseType: ExerciseType
    exerciseDurationMinute: number
    exerciseIntensity: IntensityType
    kcaloriesBurned: number
    exerciseNote: string | null
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

export interface IExerciseRecordWithOwner {
  id: string
  exerciseDate: Date
  exerciseType: ExerciseType
  exerciseDurationMinute: number
  exerciseIntensity: IntensityType
  kcaloriesBurned: number
  exerciseNote: string | null
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleExerciseRecordUseCase {
  constructor(
    private readonly exerciseRecordRepository: IExerciseRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetSingleExerciseRecordRequest
  ): Promise<GetSingleExerciseRecordResponse> {
    const { user, exerciseRecordId } = request

    const existingRecord = await this.exerciseRecordRepository.findById(
      exerciseRecordId
    )
    if (existingRecord == null) {
      throw new NotFoundError('The exercise record does not exist.')
    }

    const patientId = existingRecord.patientId

    if (user.role === UserRoleType.DOCTOR) {
      const currentDoctor = await this.doctorRepository.findByUserId(user.id)
      if (currentDoctor == null) {
        throw new AuthorizationError('The currentDoctor does not exist.')
      }
      const upComingAppointments =
        await this.consultAppointmentRepository.findByPatientIdAndDoctorIdAndStatus(
          patientId,
          currentDoctor.id,
          [ConsultAppointmentStatusType.UPCOMING]
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
          id: existingRecord.id,
          exerciseDate: existingRecord.exerciseDate,
          exerciseType: existingRecord.exerciseType,
          exerciseDurationMinute: existingRecord.exerciseDurationMinute,
          exerciseIntensity: existingRecord.exerciseIntensity,
          kcaloriesBurned: existingRecord.kcaloriesBurned,
          exerciseNote: existingRecord.exerciseNote,
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

    const currentPatient = await this.patientRepository.findByUserId(user.id)
    if (currentPatient == null) {
      throw new AuthorizationError('The current patient does not exist.')
    }

    const recordWithOwner =
      await this.exerciseRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        exerciseRecordId,
        currentPatient.id
      )

    if (recordWithOwner == null) {
      throw new AuthorizationError(
        'The current patient does not have exercise record.'
      )
    }

    return {
      data: {
        id: recordWithOwner.id,
        exerciseDate: recordWithOwner.exerciseDate,
        exerciseType: recordWithOwner.exerciseType,
        exerciseDurationMinute: recordWithOwner.exerciseDurationMinute,
        exerciseIntensity: recordWithOwner.exerciseIntensity,
        kcaloriesBurned: recordWithOwner.kcaloriesBurned,
        exerciseNote: recordWithOwner.exerciseNote,
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
