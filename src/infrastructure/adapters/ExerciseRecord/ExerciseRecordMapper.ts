import { ExerciseRecord } from '../../../domain/exerciseRecord/ExerciseRecord'
import { ExerciseRecordEntity } from './ExerciseRecordEntity'

export class ExerciseRecordMapper {
  public static toDomainModel(entity: ExerciseRecordEntity): ExerciseRecord {
    const exerciseRecord = new ExerciseRecord({
      id: entity.id,
      exerciseDate: entity.exerciseDate,
      exerciseType: entity.exerciseType,
      duration: entity.duration,
      intensity: entity.intensity,
      caloriesBurned: entity.caloriesBurned,
    })
    return exerciseRecord
  }

  public static toPersistence(
    domainModel: ExerciseRecord
  ): ExerciseRecordEntity {
    const exerciseRecordEntity = new ExerciseRecordEntity()
    exerciseRecordEntity.id = domainModel.id
    exerciseRecordEntity.exerciseDate = domainModel.exerciseDate
    exerciseRecordEntity.exerciseType = domainModel.exerciseType
    exerciseRecordEntity.duration = domainModel.duration
    exerciseRecordEntity.intensity = domainModel.intensity
    exerciseRecordEntity.caloriesBurned = domainModel.caloriesBurned

    return exerciseRecordEntity
  }
}
