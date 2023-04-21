import { ExerciseRecord } from '../../../domain/exerciseRecord/ExerciseRecord'
import { ExerciseRecordEntity } from './ExerciseRecordEntity'

export class ExerciseRecordMapper {
  public static toDomainModel(entity: ExerciseRecordEntity): ExerciseRecord {
    const exerciseRecord = new ExerciseRecord({
      id: entity.id,
      exerciseDate: entity.exerciseDate,
      exerciseType: entity.exerciseType,
      exerciseDuration: entity.exerciseDuration,
      exerciseIntensity: entity.exerciseIntensity,
      caloriesBurned: entity.caloriesBurned,
      exerciseNote: entity.exerciseNote,
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
    exerciseRecordEntity.exerciseDuration = domainModel.exerciseDuration
    exerciseRecordEntity.exerciseIntensity = domainModel.exerciseIntensity
    exerciseRecordEntity.caloriesBurned = domainModel.caloriesBurned
    exerciseRecordEntity.exerciseNote = domainModel.exerciseNote

    return exerciseRecordEntity
  }
}
