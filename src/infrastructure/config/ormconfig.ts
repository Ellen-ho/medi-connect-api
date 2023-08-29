import { DataSourceOptions } from 'typeorm'
import 'dotenv/config'

const isDevMode = process.env.TS_NODE === 'true'

const entities = isDevMode
  ? ['./src/infrastructure/entities/**/*Entity.ts']
  : ['./build/infrastructure/entities/**/*Entity.js']

const migrations = isDevMode ? ['./migrations/*.ts'] : []

const OrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT as unknown as number, // TODO: need to fix this
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  synchronize: false,
  logging: true,
  entities,
  migrations,
  migrationsTableName: 'migrations',
  // ssl: frue,
}

export default function getOrmConfig(): DataSourceOptions {
  return OrmConfig
}
