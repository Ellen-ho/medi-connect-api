import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { FoodCategoryType } from '../../domain/record/FoodRecord'
import { IFoodRecordRepository } from '../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'

interface GetSingleFoodRecordRequest {
  user: User
  foodRecordId: string
}

interface GetSingleFoodRecordResponse {
  data: {
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
      throw new Error('The food record does not exist.')
    }

    const patientId = existingRecord.patientId

    // 若登入者為doctor
    if (user.role === UserRoleType.DOCTOR) {
      const currentDoctor = await this.doctorRepository.findByUserId(user.id)
      if (currentDoctor == null) {
        throw new Error('The currentDoctor does not exist.')
      }
      const upComingAppointments =
        await this.consultAppointmentRepository.findByPatientIdAndDoctorIdAndStatus(
          patientId, // 該紀錄的擁有患者
          currentDoctor.id, // 當前登入的醫師
          [ConsultAppointmentStatusType.UPCOMING] // 預約狀態為upComing
        )
      if (upComingAppointments == null) {
        throw new Error(
          'The current doctor does not be appointed by this patient.'
        )
      }
      const appointmentPatient = await this.patientRepository.findById(
        patientId
      )
      if (appointmentPatient == null) {
        throw new Error('Patient who made the appointment does not exist.')
      }
      return {
        data: {
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

    // 若登入者身分為患者
    const currentPatient = await this.patientRepository.findByUserId(user.id)
    if (currentPatient == null) {
      throw new Error('The current patient does not exist.')
    }
    // 判斷此record是否屬於當前登入的患者
    const recordWithOwner =
      await this.foodRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        foodRecordId,
        currentPatient.id // 當前登入的patient
      )

    if (recordWithOwner == null) {
      throw new Error('The record does not belong to the current patient.')
    }

    return {
      data: {
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
