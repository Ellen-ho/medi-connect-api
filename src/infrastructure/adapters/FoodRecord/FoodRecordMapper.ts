import { FoodRecord } from '../../../domain/foodRecord/FoodRecord'
import { FoodRecordEntity } from './FoodRecordEntity'

export class FoodRecordMapper {
  public static toDomainModel(entity: FoodRecordEntity): FoodRecord {
    const foodRecord = new FoodRecord({
      id: entity.id,
      foodImage: entity.foodImage,
      foodTime: entity.foodTime,
      foodItem: entity.foodItem,
      foodCategory: entity.foodCategory,
      foodAmount: entity.foodAmount,
      kcalories: entity.kcalories,
      foodNote: entity.foodNote,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
    return foodRecord
  }

  public static toPersistence(domainModel: FoodRecord): FoodRecordEntity {
    const foodRecordEntity = new FoodRecordEntity()
    foodRecordEntity.id = domainModel.id
    foodRecordEntity.foodImage = domainModel.foodImage
    foodRecordEntity.foodTime = domainModel.foodTime
    foodRecordEntity.foodItem = domainModel.foodItem
    foodRecordEntity.foodCategory = domainModel.foodCategory
    foodRecordEntity.foodAmount = domainModel.foodAmount
    foodRecordEntity.kcalories = domainModel.kcalories
    foodRecordEntity.foodNote = domainModel.foodNote
    foodRecordEntity.createdAt = domainModel.createdAt
    foodRecordEntity.updatedAt = domainModel.updatedAt

    return foodRecordEntity
  }
}
