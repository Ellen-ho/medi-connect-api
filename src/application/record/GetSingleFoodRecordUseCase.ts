import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { FoodCategoryType } from '../../domain/record/FoodRecord'
import { IFoodRecordRepository } from '../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetSingleFoodRecordRequest {
  user: User
  foodRecordId: string
  targetPatientId: string
}

interface GetSingleFoodRecordResponse {
  data: {
    id: string
    foodTime: Date
    foodCategory: FoodCategoryType
    foodAmount: number
    kcalories: number
    foodNote: string | null
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

export interface IFoodRecordWithOwner {
  id: string
  foodTime: Date
  foodCategory: FoodCategoryType
  foodAmount: number
  kcalories: number
  foodNote: string | null
  createdAt: Date
  updatedAt: Date
  patientFirstName: string
  patientLastName: string
  patientBirthDate: Date
  patientGender: GenderType
}

export class GetSingleFoodRecordUseCase {
  constructor(
    private readonly foodRecordRepository: IFoodRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly consultAppointmentRepository: IConsultAppointmentRepository
  ) {}

  public async execute(
    request: GetSingleFoodRecordRequest
  ): Promise<GetSingleFoodRecordResponse> {
    const { user, foodRecordId } = request

    const existingRecord = await this.foodRecordRepository.findById(
      foodRecordId
    )
    if (existingRecord == null) {
      throw new NotFoundError('The food record does not exist.')
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
          foodTime: existingRecord.foodTime,
          foodCategory: existingRecord.foodCategory,
          foodAmount: existingRecord.foodAmount,
          kcalories: existingRecord.kcalories,
          foodNote: existingRecord.foodNote,
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
      await this.foodRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        foodRecordId,
        currentPatient.id
      )

    if (recordWithOwner == null) {
      throw new AuthorizationError(
        'The current patient does not have food record.'
      )
    }

    return {
      data: {
        id: recordWithOwner.id,
        foodTime: recordWithOwner.foodTime,
        foodCategory: recordWithOwner.foodCategory,
        foodAmount: recordWithOwner.foodAmount,
        kcalories: recordWithOwner.kcalories,
        foodNote: recordWithOwner.foodNote,
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
