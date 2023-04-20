import { DataSource, Repository } from 'typeorm'
import { IExerciseRecordRepository } from '../../../../domain/exerciseRecord/interfaces/repositories/IExerciseRecordRepository'
import { ExerciseRecord } from '../../../../domain/exerciseRecord/models/ExerciseRecord'
import { BaseRepository } from '../../BaseRepository'
import { ExerciseRecordEntity } from '../entities/ExerciseRecord'

export class ExerciseRecordRepository
  extends BaseRepository<ExerciseRecordEntity>
  implements IExerciseRecordRepository
{
  private readonly repo: Repository<ExerciseRecordEntity>
  constructor(dataSource: DataSource) {
    super(ExerciseRecordEntity, dataSource)
    this.repo = this.getRepo()
  }
}