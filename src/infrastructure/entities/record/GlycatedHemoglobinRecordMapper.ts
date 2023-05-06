import { GlycatedHemoglobinRecord } from '../../../domain/record/GlycatedHemoglobinRecord'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { GlycatedHemoglobinRecordEntity } from './GlycatedHemoglobinRecordEntity'

export class GlycatedHemoglobinRecordMapper
  implements
    IEntityMapper<GlycatedHemoglobinRecordEntity, GlycatedHemoglobinRecord>
{
  public toDomainModel(
    entity: GlycatedHemoglobinRecordEntity
  ): GlycatedHemoglobinRecord {
    const glycatedHemoglobinRecord = new GlycatedHemoglobinRecord({
      id: entity.id,
      glycatedHemoglobinDate: entity.glycatedHemoglobinDate,
      glycatedHemoglobinValuePercent: entity.glycatedHemoglobinValuePercent,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patientId: entity.patientId,
    })
    return glycatedHemoglobinRecord
  }

  public toPersistence(
    domainModel: GlycatedHemoglobinRecord
  ): GlycatedHemoglobinRecordEntity {
    const glycatedHemoglobinRecordEntity = new GlycatedHemoglobinRecordEntity()
    glycatedHemoglobinRecordEntity.id = domainModel.id
    glycatedHemoglobinRecordEntity.glycatedHemoglobinDate =
      domainModel.glycatedHemoglobinDate
    glycatedHemoglobinRecordEntity.glycatedHemoglobinValuePercent =
      domainModel.glycatedHemoglobinValuePercent
    glycatedHemoglobinRecordEntity.createdAt = domainModel.createdAt
    glycatedHemoglobinRecordEntity.updatedAt = domainModel.updatedAt
    glycatedHemoglobinRecordEntity.patientId = domainModel.patientId

    return glycatedHemoglobinRecordEntity
  }
}
