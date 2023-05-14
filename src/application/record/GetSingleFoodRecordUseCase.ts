import { GenderType } from '../../domain/patient/Patient'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { FoodCategoryType } from '../../domain/record/FoodRecord'
import { IFoodRecordRepository } from '../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { User } from '../../domain/user/User'

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
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: GetSingleFoodRecordRequest
  ): Promise<GetSingleFoodRecordResponse> {
    const { user, foodRecordId } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const recordWithOwner =
      await this.foodRecordRepository.findRecordWithOwnerByRecordIdAndPatientId(
        foodRecordId,
        existingPatient.id
      )

    if (recordWithOwner == null) {
      throw new Error('Record does not exist.')
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
