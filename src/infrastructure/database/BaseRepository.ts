import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import { IBaseRepository } from '../../domain/shared/IBaseRepository'
import { IEntityMapper } from '../../domain/shared/IEntityMapper'
import { IExecutor } from '../../domain/shared/IRepositoryTx'

export class BaseRepository<E extends ObjectLiteral, DM>
  implements IBaseRepository<DM>
{
  private readonly repository: Repository<E>

  constructor(
    entity: EntityTarget<E>,
    private readonly mapper: IEntityMapper<E, DM>,
    private readonly dataSource: DataSource
  ) {
    this.repository = this.dataSource.getRepository(entity)
  }

  protected getRepo(): Repository<E> {
    return this.repository
  }

  protected async getQuery<T>(
    rawQuery: string,
    rawQueryParams?: any[]
  ): Promise<T> {
    return await this.dataSource.query(rawQuery, rawQueryParams)
  }

  protected getMapper(): IEntityMapper<E, DM> {
    return this.mapper
  }

  public async save(
    doaminModel: DM,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      const entity = this.mapper.toPersistence(doaminModel)
      await executor.save(entity)
    } catch (e) {
      throw new Error('repository save error')
    }
  }
}
