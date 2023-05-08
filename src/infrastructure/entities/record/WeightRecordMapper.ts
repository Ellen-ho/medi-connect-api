import { WeightRecord } from '../../../domain/record/WeightRecord'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { WeightRecordEntity } from './WeightRecordEntity'

export class WeightRecordMapper
  implements IEntityMapper<WeightRecordEntity, WeightRecord>
{
  public toDomainModel(entity: WeightRecordEntity): WeightRecord {
    const weightRecord = new WeightRecord({
      id: entity.id,
      weightDate: entity.weightDate,
      weightValueKg: entity.weightValueKg,
      bodyMassIndex: entity.bodyMassIndex,
      weightNote: entity.weightNote,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patientId: entity.patientId,
    })
    return weightRecord
  }

  public toPersistence(domainModel: WeightRecord): WeightRecordEntity {
    const weightRecordEntity = new WeightRecordEntity()
    weightRecordEntity.id = domainModel.id
    weightRecordEntity.weightDate = domainModel.weightDate
    weightRecordEntity.weightValueKg = domainModel.weightValueKg
    weightRecordEntity.bodyMassIndex = domainModel.bodyMassIndex
    weightRecordEntity.weightNote = domainModel.weightNote
    weightRecordEntity.createdAt = domainModel.createdAt
    weightRecordEntity.updatedAt = domainModel.updatedAt
    weightRecordEntity.patientId = domainModel.patientId

    return weightRecordEntity
  }
}
