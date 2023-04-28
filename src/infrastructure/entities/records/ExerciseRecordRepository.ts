import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'

import { IExerciseRecordRepository } from '../../../domain/record/interfaces/repositories/IExerciseRepository'
import { ExerciseRecord } from '../../../domain/record/ExerciseRecord'
import { ExerciseRecordEntity } from './ExerciseRecordEntity'
import { ExerciseRecordMapper } from './ExerciseRecordMapper'
import { RepositoryError } from '../../error/RepositoryError'

export class ExerciseRecordRepository
  extends BaseRepository<ExerciseRecordEntity, ExerciseRecord>
  implements IExerciseRecordRepository
{
  constructor(dataSource: DataSource) {
    super(ExerciseRecordEntity, new ExerciseRecordMapper(), dataSource)
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<ExerciseRecord | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: recordId,
          patient: { id: patientId }, // need to set @RelationId
        },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'ExerciseRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }
}
