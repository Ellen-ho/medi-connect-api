import { DataSource } from 'typeorm'
import 'dotenv/config'

// TODO: need to create a config class for envs
const connectDB = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT as unknown as number, // TODO: need to fix this
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  synchronize: false,
  logging: true,
  entities: ['src/entity/**/*.ts'],
  migrations: ['./migrations/*.ts'],
})

export default connectDB
