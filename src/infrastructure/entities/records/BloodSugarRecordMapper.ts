import { BloodSugarRecord } from '../../../domain/record/BloodSugarRecord'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { PatientMapper } from '../patient/PatientMapper'
import { BloodSugarRecordEntity } from './BloodSugarRecordEntity'

export class BloodSugarRecordMapper
  implements IEntityMapper<BloodSugarRecordEntity, BloodSugarRecord>
{
  public toDomainModel(entity: BloodSugarRecordEntity): BloodSugarRecord {
    const bloodSugarRecord = new BloodSugarRecord({
      id: entity.id,
      bloodSugarDate: entity.bloodSugarDate,
      bloodSugarValueMmo: entity.bloodSugarValueMmo,
      bloodSugarNote: entity.bloodSugarNote,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patient: new PatientMapper().toDomainModel(entity.patient),
    })
    return bloodSugarRecord
  }

  public toPersistence(domainModel: BloodSugarRecord): BloodSugarRecordEntity {
    const bloodSugarRecordEntity = new BloodSugarRecordEntity()
    bloodSugarRecordEntity.id = domainModel.id
    bloodSugarRecordEntity.bloodSugarDate = domainModel.bloodSugarDate
    bloodSugarRecordEntity.bloodSugarValueMmo = domainModel.bloodSugarValueMmo
    bloodSugarRecordEntity.bloodSugarNote = domainModel.bloodSugarNote
    bloodSugarRecordEntity.createdAt = domainModel.createdAt
    bloodSugarRecordEntity.updatedAt = domainModel.updatedAt
    bloodSugarRecordEntity.patient = new PatientMapper().toPersistence(
      domainModel.patient
    )

    return bloodSugarRecordEntity
  }
}
