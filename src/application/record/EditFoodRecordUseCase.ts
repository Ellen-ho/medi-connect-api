import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { FoodCategoryType } from '../../domain/record/FoodRecord'
import { IFoodRecordRepository } from '../../domain/record/interfaces/repositories/IFoodRecordRepository'

import { User } from '../../domain/user/User'

interface EditFoodRecordRequest {
  user: User
  foodRecordId: string
  foodTime: Date
  foodCategory: FoodCategoryType
  foodAmount: number
  foodNote: string | null
}

interface EditFoodRecordResponse {
  id: string
  foodTime: Date
  foodCategory: FoodCategoryType
  foodAmount: number
  kcalories: number
  foodNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class EditFoodRecordUseCase {
  constructor(
    private readonly foodRecordRepository: IFoodRecordRepository,
    private readonly patientRepository: IPatientRepository
  ) {}

  public async execute(
    request: EditFoodRecordRequest
  ): Promise<EditFoodRecordResponse> {
    const { user, foodRecordId, foodTime, foodCategory, foodAmount, foodNote } =
      request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const existingFoodRecord =
      await this.foodRecordRepository.findByIdAndPatientId(
        foodRecordId,
        existingPatient.id
      )

    if (existingFoodRecord == null) {
      throw new Error('This food record does not exist.')
    }

    existingFoodRecord.updateData({
      foodTime,
      foodCategory,
      foodAmount,
      kcalories: 500,
      foodNote,
    })

    await this.foodRecordRepository.save(existingFoodRecord)

    return {
      id: existingFoodRecord.id,
      foodTime: existingFoodRecord.foodTime,
      foodCategory: existingFoodRecord.foodCategory,
      foodAmount: existingFoodRecord.foodAmount,
      kcalories: existingFoodRecord.kcalories,
      foodNote: existingFoodRecord.foodNote,
      createdAt: existingFoodRecord.createdAt,
      updatedAt: existingFoodRecord.updatedAt,
    }
  }
}
