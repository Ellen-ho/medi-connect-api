import { SleepRecord } from '../../../domain/sleepRecord/SleepRecord'
import { SleepRecordEntity } from './SleepRecordEntity'

export class SleepRecordMapper {
  public static toDomainModel(entity: SleepRecordEntity): SleepRecord {
    const sleepRecord = new SleepRecord({
      id: entity.id,
      sleepDate: entity.sleepDate,
      sleepTime: entity.sleepTime,
      wakeUpTime: entity.wakeUpTime,
      sleepQuality: entity.sleepQuality,
      sleepDuration: entity.sleepDuration,
      sleepNote: entity.sleepNote,
    })
    return sleepRecord
  }

  public static toPersistence(domainModel: SleepRecord): SleepRecordEntity {
    const sleepRecordEntity = new SleepRecordEntity()
    sleepRecordEntity.id = domainModel.id
    sleepRecordEntity.sleepDate = domainModel.sleepDate
    sleepRecordEntity.sleepTime = domainModel.sleepTime
    sleepRecordEntity.wakeUpTime = domainModel.wakeUpTime
    sleepRecordEntity.sleepQuality = domainModel.sleepQuality
    sleepRecordEntity.sleepDuration = domainModel.sleepDuration
    sleepRecordEntity.sleepNote = domainModel.sleepNote

    return sleepRecordEntity
  }
}
