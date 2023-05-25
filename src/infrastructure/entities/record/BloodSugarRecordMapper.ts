import { BloodSugarRecord } from '../../../domain/record/BloodSugarRecord'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { BloodSugarRecordEntity } from './BloodSugarRecordEntity'

export class BloodSugarRecordMapper
  implements IEntityMapper<BloodSugarRecordEntity, BloodSugarRecord>
{
  public toDomainModel(entity: BloodSugarRecordEntity): BloodSugarRecord {
    const bloodSugarRecord = new BloodSugarRecord({
      id: entity.id,
      bloodSugarDate: entity.bloodSugarDate,
      bloodSugarValue: entity.bloodSugarValue,
      bloodSugarType: entity.bloodSugarType,
      bloodSugarNote: entity.bloodSugarNote,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patientId: entity.patientId,
    })
    return bloodSugarRecord
  }

  public toPersistence(domainModel: BloodSugarRecord): BloodSugarRecordEntity {
    const bloodSugarRecordEntity = new BloodSugarRecordEntity()
    bloodSugarRecordEntity.id = domainModel.id
    bloodSugarRecordEntity.bloodSugarDate = domainModel.bloodSugarDate
    bloodSugarRecordEntity.bloodSugarValue = domainModel.bloodSugarValue
    bloodSugarRecordEntity.bloodSugarType = domainModel.bloodSugarType
    bloodSugarRecordEntity.bloodSugarNote = domainModel.bloodSugarNote
    bloodSugarRecordEntity.createdAt = domainModel.createdAt
    bloodSugarRecordEntity.updatedAt = domainModel.updatedAt
    bloodSugarRecordEntity.patientId = domainModel.patientId

    return bloodSugarRecordEntity
  }
}
