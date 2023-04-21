import { GlycatedHemoglobinRecord } from '../../../domain/glycatedHemoglobinRecord/GlycatedHemoglobinRecord'
import { GlycatedHemoglobinRecordEntity } from './GlycatedHemoglobinRecordEntity'

export class GlycatedHemoglobinRecordMapper {
  public static toDomainModel(
    entity: GlycatedHemoglobinRecordEntity
  ): GlycatedHemoglobinRecord {
    const glycatedHemoglobinRecord = new GlycatedHemoglobinRecord({
      id: entity.id,
      glycatedHemoglobinDate: entity.glycatedHemoglobinDate,
      glycatedHemoglobinValue: entity.glycatedHemoglobinValue,
      glycatedHemoglobinUnit: entity.glycatedHemoglobinUnit,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
    return glycatedHemoglobinRecord
  }

  public static toPersistence(
    domainModel: GlycatedHemoglobinRecord
  ): GlycatedHemoglobinRecordEntity {
    const glycatedHemoglobinRecordEntity = new GlycatedHemoglobinRecordEntity()
    glycatedHemoglobinRecordEntity.id = domainModel.id
    glycatedHemoglobinRecordEntity.glycatedHemoglobinDate =
      domainModel.glycatedHemoglobinDate
    glycatedHemoglobinRecordEntity.glycatedHemoglobinValue =
      domainModel.glycatedHemoglobinValue
    glycatedHemoglobinRecordEntity.glycatedHemoglobinUnit =
      domainModel.glycatedHemoglobinUnit
    glycatedHemoglobinRecordEntity.createdAt = domainModel.createdAt
    glycatedHemoglobinRecordEntity.updatedAt = domainModel.updatedAt

    return glycatedHemoglobinRecordEntity
  }
}
