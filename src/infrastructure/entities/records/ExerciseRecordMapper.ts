import { ExerciseRecord } from '../../../domain/record/ExerciseRecord'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { PatientMapper } from '../patient/PatientMapper'
import { ExerciseRecordEntity } from './ExerciseRecordEntity'

export class ExerciseRecordMapper
  implements IEntityMapper<ExerciseRecordEntity, ExerciseRecord>
{
  public toDomainModel(entity: ExerciseRecordEntity): ExerciseRecord {
    const exerciseRecord = new ExerciseRecord({
      id: entity.id,
      exerciseDate: entity.exerciseDate,
      exerciseType: entity.exerciseType,
      exerciseDurationMinute: entity.exerciseDurationMinute,
      exerciseIntensity: entity.exerciseIntensity,
      kcaloriesBurned: entity.kcaloriesBurned,
      exerciseNote: entity.exerciseNote,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patient: new PatientMapper().toDomainModel(entity.patient),
    })
    return exerciseRecord
  }

  public toPersistence(domainModel: ExerciseRecord): ExerciseRecordEntity {
    const exerciseRecordEntity = new ExerciseRecordEntity()
    exerciseRecordEntity.id = domainModel.id
    exerciseRecordEntity.exerciseDate = domainModel.exerciseDate
    exerciseRecordEntity.exerciseType = domainModel.exerciseType
    exerciseRecordEntity.exerciseDurationMinute =
      domainModel.exerciseDurationMinute
    exerciseRecordEntity.exerciseIntensity = domainModel.exerciseIntensity
    exerciseRecordEntity.kcaloriesBurned = domainModel.kcaloriesBurned
    exerciseRecordEntity.exerciseNote = domainModel.exerciseNote
    exerciseRecordEntity.createdAt = domainModel.createdAt
    exerciseRecordEntity.updatedAt = domainModel.updatedAt
    exerciseRecordEntity.patient = new PatientMapper().toPersistence(
      domainModel.patient
    )

    return exerciseRecordEntity
  }
}
