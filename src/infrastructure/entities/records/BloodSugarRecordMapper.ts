import { BloodSugarRecord } from '../../../domain/record/BloodSugarRecord'
import { PatientMapper } from '../patient/PatientMapper'
import { BloodSugarRecordEntity } from './BloodSugarRecordEntity'

export class BloodSugarRecordMapper {
  public static toDomainModel(
    entity: BloodSugarRecordEntity
  ): BloodSugarRecord {
    const bloodSugarRecord = new BloodSugarRecord({
      id: entity.id,
      bloodSugarDate: entity.bloodSugarDate,
      bloodSugarValue: entity.bloodSugarValue,
      bloodSugarUnit: entity.bloodSugarUnit,
      bloodSugarNote: entity.bloodSugarNote,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patient: PatientMapper.toDomainModel(entity.patient),
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
    bloodSugarRecordEntity.bloodSugarUnit = domainModel.bloodSugarUnit
    bloodSugarRecordEntity.bloodSugarNote = domainModel.bloodSugarNote
    bloodSugarRecordEntity.createdAt = domainModel.createdAt
    bloodSugarRecordEntity.updatedAt = domainModel.updatedAt
    bloodSugarRecordEntity.patient = PatientMapper.toPersistence(
      domainModel.patient
    )

    return bloodSugarRecordEntity
  }
}
