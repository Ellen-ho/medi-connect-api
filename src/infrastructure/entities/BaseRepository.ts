import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import { IBaseRepository } from '../../domain/shared/IBaseRepository'
import { IEntityMapper } from '../../domain/shared/IEntityMapper'

export class BaseRepository<E extends ObjectLiteral, DM>
  implements IBaseRepository<DM>
{
  private readonly repository: Repository<E>

  constructor(
    entity: EntityTarget<E>,
    private readonly mapper: IEntityMapper<E, DM>,
    dataSource: DataSource
  ) {
    this.repository = dataSource.getRepository(entity)
  }

  protected getRepo(): Repository<E> {
    return this.repository
  }

  protected getMapper(): IEntityMapper<E, DM> {
    return this.mapper
  }

  public async save(doaminModel: DM): Promise<void> {
    try {
      const entity = this.mapper.toPersistence(doaminModel)
      await this.repository.save(entity)
    } catch (e) {
      throw new Error('repository save error')
    }
  }
}
