import { SleepRecord } from '../../../domain/record/SleepRecord'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
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
      sleepDurationHour: parseFloat(entity.sleepDurationHour),
      sleepNote: entity.sleepNote,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patientId: entity.patientId,
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
    sleepRecordEntity.sleepDurationHour =
      domainModel.sleepDurationHour.toString()
    sleepRecordEntity.sleepNote = domainModel.sleepNote
    sleepRecordEntity.createdAt = domainModel.createdAt
    sleepRecordEntity.updatedAt = domainModel.updatedAt
    sleepRecordEntity.patientId = domainModel.patientId

    return sleepRecordEntity
  }
}
