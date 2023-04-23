import { Patient } from '../../domain/patient/Patient'
import { FoodCategoryType, FoodRecord } from '../../domain/record/FoodRecord'
import { IFoodRecordRepository } from '../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateFoodRecordRequest {
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

export class CreateFoodRecord {
  constructor(
    private readonly foodRecordRepository: IFoodRecordRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateFoodRecordRequest
  ): Promise<CreateFoodRecordResponse> {
    const { foodTime, foodCategory, foodAmount, foodNote } = request

    // kc,foodTime,foodImage
    const foodRecord = new FoodRecord({
      id: this.uuidService.generateUuid(),
      foodImage: null,
      foodTime,
      foodItem: null,
      foodCategory,
      foodAmount,
      kcalories: 355, // TODO: mock here, need standard mapping later
      foodNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: new Patient(),
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
