import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import getOrmConfig from '../config/ormconfig'

export class PostgresDatabase {
  private dataSource: DataSource | null

  constructor() {
    this.dataSource = null
  }

  public async connect(): Promise<void> {
    try {
      this.dataSource = new DataSource(getOrmConfig())
      await this.dataSource.initialize()
      console.log(`Data Source has been initialized`)
    } catch (error) {
      console.error(`Data Source initialization error`, error)
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.dataSource?.destroy()
      console.log(`Data Source has been destroyed`)
    } catch (error) {
      console.error(`Data Source destroy error`, error)
    }
  }

  public getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>
  ): Repository<T> {
    if (this.dataSource == null) {
      throw new Error('Data Source is not initialized')
    }
    return this.dataSource.getRepository(entity)
  }

  public getDataSource(): DataSource {
    if (this.dataSource == null) {
      throw new Error('Data Source is not initialized')
    }
    return this.dataSource
  }
}
