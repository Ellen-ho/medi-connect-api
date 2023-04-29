import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { GlycatedHemoglobinRecordEntity } from './GlycatedHemoglobinRecordEntity'

import { GlycatedHemoglobinRecord } from '../../../domain/record/GlycatedHemoglobinRecord'
import { GlycatedHemoglobinRecordMapper } from './GlycatedHemoglobinRecordMapper'
import { IGlycatedHemoglobinRecordRepository } from '../../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'
import { RepositoryError } from '../../error/RepositoryError'

export class GlycatedHemoglobinRecordRepository
  extends BaseRepository<
    GlycatedHemoglobinRecordEntity,
    GlycatedHemoglobinRecord
  >
  implements IGlycatedHemoglobinRecordRepository
{
  constructor(dataSource: DataSource) {
    super(
      GlycatedHemoglobinRecordEntity,
      new GlycatedHemoglobinRecordMapper(),
      dataSource
    )
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<GlycatedHemoglobinRecord | null> {
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
        'GlycatedHemoglobinRecordRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }
}
