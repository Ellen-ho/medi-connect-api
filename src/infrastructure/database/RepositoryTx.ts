import { DataSource, QueryRunner } from 'typeorm'
import {
  IExecutor,
  IRepositoryTx,
  Isolation,
} from '../../domain/shared/IRepositoryTx'

export class RepositoryTx implements IRepositoryTx {
  private readonly queryRunner: QueryRunner

  constructor(dataSource: DataSource) {
    this.queryRunner = dataSource.createQueryRunner()
  }

  public async start(isolation: Isolation = 'READ COMMITTED'): Promise<void> {
    await this.queryRunner.connect()
    await this.queryRunner.startTransaction(isolation)
  }

  public async rollback(): Promise<void> {
    await this.queryRunner.rollbackTransaction()
    await this.queryRunner.release()
  }

  public async end(): Promise<void> {
    await this.queryRunner.commitTransaction()
    await this.queryRunner.release()
  }

  public getExecutor(): IExecutor {
    return this.queryRunner.manager
  }
}
