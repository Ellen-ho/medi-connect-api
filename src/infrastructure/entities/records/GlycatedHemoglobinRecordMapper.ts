import { GlycatedHemoglobinRecord } from '../../../domain/record/GlycatedHemoglobinRecord'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { PatientMapper } from '../patient/PatientMapper'
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
      glycatedHemoglobinValue: entity.glycatedHemoglobinValue,
      glycatedHemoglobinUnit: entity.glycatedHemoglobinUnit,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patient: new PatientMapper().toDomainModel(entity.patient),
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
    glycatedHemoglobinRecordEntity.glycatedHemoglobinValue =
      domainModel.glycatedHemoglobinValue
    glycatedHemoglobinRecordEntity.glycatedHemoglobinUnit =
      domainModel.glycatedHemoglobinUnit
    glycatedHemoglobinRecordEntity.createdAt = domainModel.createdAt
    glycatedHemoglobinRecordEntity.updatedAt = domainModel.updatedAt
    glycatedHemoglobinRecordEntity.patient = new PatientMapper().toPersistence(
      domainModel.patient
    )

    return glycatedHemoglobinRecordEntity
  }
}
