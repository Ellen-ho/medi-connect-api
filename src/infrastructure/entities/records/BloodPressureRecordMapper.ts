import { BloodPressureRecord } from '../../../domain/record/BloodPressureRecord'
import { PatientMapper } from '../patient/PatientMapper'
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
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patient: PatientMapper.toDomainModel(entity.patient),
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
    bloodPressureRecordEntity.createdAt = domainModel.createdAt
    bloodPressureRecordEntity.updatedAt = domainModel.updatedAt
    bloodPressureRecordEntity.patient = PatientMapper.toPersistence(
      domainModel.patient
    )

    return bloodPressureRecordEntity
  }
}
