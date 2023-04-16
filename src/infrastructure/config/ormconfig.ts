import { DataSourceOptions } from 'typeorm'
import 'dotenv/config'

const OrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT as unknown as number, // TODO: need to fix this
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  synchronize: false,
  logging: true,
  entities: ['./src/infrastructure/adapters/**/entities/*.ts'],
  migrations: ['./migrations/*.ts'],
  migrationsTableName: 'migrations',
}

export default function getOrmConfig(): DataSourceOptions {
  return OrmConfig
}
