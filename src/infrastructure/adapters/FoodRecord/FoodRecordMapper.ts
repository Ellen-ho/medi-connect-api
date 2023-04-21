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
      amount: entity.amount,
      calories: entity.calories,
      foodNote: entity.foodNote,
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
    foodRecordEntity.amount = domainModel.amount
    foodRecordEntity.calories = domainModel.calories
    foodRecordEntity.foodNote = domainModel.foodNote
    return foodRecordEntity
  }
}
