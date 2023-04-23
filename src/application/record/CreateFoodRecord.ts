import { Patient } from '../../domain/patient/Patient'
import { FoodCategoryType, FoodRecord } from '../../domain/record/FoodRecord'
import { IFoodRecordRepository } from '../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateFoodRecordRequestDTO {
  foodImage: string | null
  foodTime: Date
  // foodItem: string | null
  foodCategory: FoodCategoryType
  foodAmount: number
  // kcalories: number
  foodNote: string | null
}

interface CreateFoodRecordResponseDTO {
  id: string
  foodImage: string | null
  foodTime: Date
  // foodItem: string | null
  foodCategory: FoodCategoryType
  foodAmount: number
  kcalories: number
  foodNote: string | null
  createdAt: Date
  updatedAt: Date
  patient: Patient
}

export class CreateFoodRecord {
  constructor(
    private readonly foodRecordRepository: IFoodRecordRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateFoodRecordRequestDTO
  ): Promise<CreateFoodRecordResponseDTO> {
    const {
      foodImage,
      foodTime,
      // foodItem,
      foodCategory,
      foodAmount,
      foodNote,
    } = request

    // kc,foodTime,foodImage
    const foodRecord = new FoodRecord({
      id: this.uuidService.generateUuid(),
      foodImage,
      foodTime,
      foodItem,
      foodCategory,
      foodAmount,
      kcalories: 355,
      foodNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: new Patient(),
    })
    await this.foodRecordRepository.save(foodRecord)

    return {
      id: foodRecord.id,
      foodImage: foodRecord.foodImage,
      foodTime: foodRecord.foodTime,
      foodItem: foodRecord.foodItem,
      foodCategory: foodRecord.foodCategory,
      foodAmount: foodRecord.foodAmount,
      kcalories: foodRecord.kcalories,
      foodNote: foodRecord.foodNote,
      createdAt: foodRecord.createdAt,
      updatedAt: foodRecord.updatedAt,
      patient: foodRecord.patient,
    }
  }
}
