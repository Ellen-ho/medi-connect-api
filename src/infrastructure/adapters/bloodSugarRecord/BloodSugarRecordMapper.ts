import { BloodSugarRecord } from '../../../domain/bloodSugarRecord/BloodSugarRecord'
import { BloodSugarRecordEntity } from './BloodSugarRecordEntity'

export class BloodSugarRecordMapper {
  public static toDomainModel(
    entity: BloodSugarRecordEntity
  ): BloodSugarRecord {
    const bloodSugarRecord = new BloodSugarRecord({
      id: entity.id,
      bloodSugarDate: entity.bloodSugarDate,
      bloodSugarValue: entity.bloodSugarValue,
      bloodSugarNote: entity.bloodSugarNote,
    })
    return bloodSugarRecord
  }

  public static toPersistence(
    domainModel: BloodSugarRecord
  ): BloodSugarRecordEntity {
    const bloodSugarRecordEntity = new BloodSugarRecordEntity()
    bloodSugarRecordEntity.id = domainModel.id
    bloodSugarRecordEntity.bloodSugarDate = domainModel.bloodSugarDate
    bloodSugarRecordEntity.bloodSugarValue = domainModel.bloodSugarValue
    bloodSugarRecordEntity.bloodSugarNote = domainModel.bloodSugarNote

    return bloodSugarRecordEntity
  }
}
