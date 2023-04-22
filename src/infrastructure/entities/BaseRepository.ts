import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm'

export class BaseRepository<T extends ObjectLiteral> {
  private readonly repository: Repository<T>

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity)
  }

  protected getRepo(): Repository<T> {
    return this.repository
  }
}
