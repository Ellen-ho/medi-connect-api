import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { FoodCategoryType, FoodRecord } from '../../domain/record/FoodRecord'
import { IFoodRecordRepository } from '../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'

interface CreateFoodRecordRequest {
  user: User
  foodTime: Date
  foodCategory: FoodCategoryType
  foodAmount: number
  foodNote: string | null
}

interface CreateFoodRecordResponse {
  id: string
  foodTime: Date
  foodCategory: FoodCategoryType
  foodAmount: number
  kcalories: number
  foodNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class CreateFoodRecordUseCase {
  constructor(
    private readonly foodRecordRepository: IFoodRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateFoodRecordRequest
  ): Promise<CreateFoodRecordResponse> {
    const { user, foodTime, foodCategory, foodAmount, foodNote } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const foodRecord = new FoodRecord({
      id: this.uuidService.generateUuid(),
      foodImage: null,
      foodTime,
      foodItem: null,
      foodCategory,
      foodAmount,
      kcalories: FoodRecord.calculateTotalKcalories(foodCategory, foodAmount),
      foodNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
    })
    await this.foodRecordRepository.save(foodRecord)

    return {
      id: foodRecord.id,
      foodTime: foodRecord.foodTime,
      foodCategory: foodRecord.foodCategory,
      foodAmount: foodRecord.foodAmount,
      kcalories: foodRecord.kcalories,
      foodNote: foodRecord.foodNote,
      createdAt: foodRecord.createdAt,
      updatedAt: foodRecord.updatedAt,
    }
  }
}
