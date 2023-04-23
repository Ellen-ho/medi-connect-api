import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'

import { IExerciseRecordRepository } from '../../../domain/record/interfaces/repositories/IExerciseRepository'
import { ExerciseRecord } from '../../../domain/record/ExerciseRecord'
import { ExerciseRecordEntity } from './ExerciseRecordEntity'
import { ExerciseRecordMapper } from './ExerciseRecordMapper'

export class ExerciseRecordRepository
  extends BaseRepository<ExerciseRecordEntity, ExerciseRecord>
  implements IExerciseRecordRepository
{
  constructor(dataSource: DataSource) {
    super(ExerciseRecordEntity, new ExerciseRecordMapper(), dataSource)
  }

  public async findById(id: string): Promise<ExerciseRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }
}
