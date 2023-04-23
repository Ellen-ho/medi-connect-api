import { SleepRecord } from '../../../domain/record/SleepRecord'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { PatientMapper } from '../patient/PatientMapper'
import { SleepRecordEntity } from './SleepRecordEntity'

export class SleepRecordMapper
  implements IEntityMapper<SleepRecordEntity, SleepRecord>
{
  public toDomainModel(entity: SleepRecordEntity): SleepRecord {
    const sleepRecord = new SleepRecord({
      id: entity.id,
      sleepDate: entity.sleepDate,
      sleepTime: entity.sleepTime,
      wakeUpTime: entity.wakeUpTime,
      sleepQuality: entity.sleepQuality,
      sleepDurationHour: entity.sleepDurationHour,
      sleepNote: entity.sleepNote,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patient: new PatientMapper().toDomainModel(entity.patient),
    })
    return sleepRecord
  }

  public toPersistence(domainModel: SleepRecord): SleepRecordEntity {
    const sleepRecordEntity = new SleepRecordEntity()
    sleepRecordEntity.id = domainModel.id
    sleepRecordEntity.sleepDate = domainModel.sleepDate
    sleepRecordEntity.sleepTime = domainModel.sleepTime
    sleepRecordEntity.wakeUpTime = domainModel.wakeUpTime
    sleepRecordEntity.sleepQuality = domainModel.sleepQuality
    sleepRecordEntity.sleepDurationHour = domainModel.sleepDurationHour
    sleepRecordEntity.sleepNote = domainModel.sleepNote
    sleepRecordEntity.createdAt = domainModel.createdAt
    sleepRecordEntity.updatedAt = domainModel.updatedAt
    sleepRecordEntity.patient = new PatientMapper().toPersistence(
      domainModel.patient
    )

    return sleepRecordEntity
  }
}
