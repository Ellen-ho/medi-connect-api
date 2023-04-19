import 'reflect-metadata'
import express, { Express } from 'express'
import dotenv from 'dotenv'
import { PostgresDatabase } from './infrastructure/database/PostgresDatabase'
import { UuidService } from './infrastructure/utils/uuid'
import { UserRepository } from './infrastructure/adapters/User/repositories/UserRepository'
import { GetUser } from './application/user/GetUser'
import { CreateUser } from './application/user/CreateUser'
import { UserController } from './infrastructure/http/controllers/UserController'
import { UserRoutes } from './infrastructure/http/routes/UserRoutes'
import { MainRoutes } from './infrastructure/http/routes'

void main()

async function main(): Promise<void> {
  // TODO: should active only on dev environment
  dotenv.config()
  const port = process.env.API_PORT as string

  /**
   * Database Connection
   */
  const postgresDatabase = new PostgresDatabase()
  await postgresDatabase.connect()
  const dataSource = postgresDatabase.getDataSource()

  /**
   * Shared Services
   */
  const uuidService = new UuidService()

  /**
   * User Domain
   */
  const userRepository = new UserRepository(dataSource)
  const getUser = new GetUser(userRepository)
  const createUser = new CreateUser(userRepository, uuidService)
  const userController = new UserController(getUser, createUser)

  /**
   * Routes
   */
  const userRoutes = new UserRoutes(userController)
  const mainRoutes = new MainRoutes(userRoutes)

  const app: Express = express()
  app.use(express.json())
  app.use('/api', mainRoutes.createRouter())

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}
