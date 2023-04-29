import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { SleepRecordEntity } from './SleepRecordEntity'
import { SleepRecordMapper } from './SleepRecordMapper'
import { SleepRecord } from '../../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../../domain/record/interfaces/repositories/ISleepRecordRepository'
import { RepositoryError } from '../../error/RepositoryError'

export class SleepRecordRepository
  extends BaseRepository<SleepRecordEntity, SleepRecord>
  implements ISleepRecordRepository
{
  constructor(dataSource: DataSource) {
    super(SleepRecordEntity, new SleepRecordMapper(), dataSource)
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<SleepRecord | null> {
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
        'SleepRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }
}
