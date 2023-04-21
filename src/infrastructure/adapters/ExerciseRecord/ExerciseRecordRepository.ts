import { DataSource, Repository } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { ExerciseRecordEntity } from './ExerciseRecord'
import { IExerciseRecordRepository } from '../../../domain/exerciseRecord/interfaces/repositories/IExerciseRepository'
import { ExerciseRecord } from '../../../domain/exerciseRecord/ExerciseRecord'
import { ExerciseRecordMapper } from './ExerciseRecordMapper'

export class ExerciseRecordRepository
  extends BaseRepository<ExerciseRecordEntity>
  implements IExerciseRecordRepository
{
  private readonly repo: Repository<ExerciseRecordEntity>
  constructor(dataSource: DataSource) {
    super(ExerciseRecordEntity, dataSource)
    this.repo = this.getRepo()
  }

  public async findById(id: string): Promise<ExerciseRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? ExerciseRecordMapper.toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async save(exerciseRecord: ExerciseRecord): Promise<void> {
    try {
      await this.getRepo().save(exerciseRecord)
    } catch (e) {
      throw new Error('repository findByEmail error')
    }
  }
}
