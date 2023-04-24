import 'reflect-metadata'
import express, { Express } from 'express'
import dotenv from 'dotenv'
import { PostgresDatabase } from './infrastructure/database/PostgresDatabase'
import { UuidService } from './infrastructure/utils/UuidService'
import { UserRepository } from './infrastructure/entities/user/UserRepository'
import { GetUserUseCase } from './application/user/GetUserUseCase'
import { CreateUserUseCase } from './application/user/CreateUserUseCase'
import { UserController } from './infrastructure/http/controllers/UserController'
import { UserRoutes } from './infrastructure/http/routes/UserRoutes'
import { MainRoutes } from './infrastructure/http/routes'
import { errorHandler } from './infrastructure/http/middlewares/ErrorHandler'
import { BcryptHashGenerator } from './infrastructure/utils/BcryptHashGenerator'
import { PassportConfig } from './infrastructure/config/passportConfig'
import { PatientRoutes } from './infrastructure/http/routes/PatientRoutes'
import { PatientController } from './infrastructure/http/controllers/PatientController'
import { CreatePatientProfileUseCase } from './application/patient/CreatePatientProfileUseCase'
import { EditPatientProfileUseCase } from './application/patient/EditPatientProfileUseCase'
import { PatientRepository } from './infrastructure/entities/patient/PatientRepository'

void main()

async function main(): Promise<void> {
  // TODO: should active only on dev environment
  dotenv.config()
  const env = process.env
  const port = env.API_PORT as string

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
  const hashGenerator = new BcryptHashGenerator()

  /**
   * User Domain
   */
  const userRepository = new UserRepository(dataSource)
  const getUserUseCase = new GetUserUseCase(userRepository)
  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    uuidService,
    hashGenerator
  )

  const patientRepository = new PatientRepository(dataSource)
  const createPatientProfileUseCase = new CreatePatientProfileUseCase(
    patientRepository,
    uuidService
  )
  const editPatientProfileUseCase = new EditPatientProfileUseCase(
    patientRepository
  )

  /**
   * Controllers
   */
  const userController = new UserController(getUserUseCase, createUserUseCase)
  const patientController = new PatientController(
    createPatientProfileUseCase,
    editPatientProfileUseCase
  )

  const app: Express = express()
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  // eslint-disable-next-line no-new
  new PassportConfig(userRepository)

  /**
   * Routes
   */
  const userRoutes = new UserRoutes(userController)
  const patientRoutes = new PatientRoutes(patientController)

  const mainRoutes = new MainRoutes(userRoutes, patientRoutes)
  app.use('/api', mainRoutes.createRouter())

  app.use(errorHandler)

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}
