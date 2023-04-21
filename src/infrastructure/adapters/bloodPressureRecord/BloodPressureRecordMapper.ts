import { BloodPressureRecord } from '../../../domain/bloodPressureRecord/BloodPressureRecord'
import { BloodPressureRecordEntity } from './BloodPressureRecordEntity'

export class BloodPressureRecordMapper {
  public static toDomainModel(
    entity: BloodPressureRecordEntity
  ): BloodPressureRecord {
    const bloodPressureRecord = new BloodPressureRecord({
      id: entity.id,
      bloodPressureDate: entity.bloodPressureDate,
      systolicBloodPressure: entity.systolicBloodPressure,
      diastolicBloodPressure: entity.diastolicBloodPressure,
      heartBeat: entity.heartBeat,
      bloodPressureNote: entity.bloodPressureNote,
    })
    return bloodPressureRecord
  }

  public static toPersistence(
    domainModel: BloodPressureRecord
  ): BloodPressureRecordEntity {
    const bloodPressureRecordEntity = new BloodPressureRecordEntity()
    bloodPressureRecordEntity.id = domainModel.id
    bloodPressureRecordEntity.bloodPressureDate = domainModel.bloodPressureDate
    bloodPressureRecordEntity.systolicBloodPressure =
      domainModel.systolicBloodPressure
    bloodPressureRecordEntity.diastolicBloodPressure =
      domainModel.diastolicBloodPressure
    bloodPressureRecordEntity.heartBeat = domainModel.heartBeat
    bloodPressureRecordEntity.bloodPressureNote = domainModel.bloodPressureNote

    return bloodPressureRecordEntity
  }
}
