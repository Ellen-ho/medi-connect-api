import { FoodRecord } from '../../../domain/record/FoodRecord'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { PatientMapper } from '../patient/PatientMapper'
import { FoodRecordEntity } from './FoodRecordEntity'

export class FoodRecordMapper
  implements IEntityMapper<FoodRecordEntity, FoodRecord>
{
  public toDomainModel(entity: FoodRecordEntity): FoodRecord {
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
      patient: new PatientMapper().toDomainModel(entity.patient),
    })
    return foodRecord
  }

  public toPersistence(domainModel: FoodRecord): FoodRecordEntity {
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
    foodRecordEntity.patient = new PatientMapper().toPersistence(
      domainModel.patient
    )

    return foodRecordEntity
  }
}
