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
import { RecordRoutes } from './infrastructure/http/routes/RecordRoutes'
import { BloodPressureRecordRepository } from './infrastructure/entities/records/BloodPressureRecordRepository'
import { CreateBloodPressureRecordUseCase } from './application/record/CreateBloodPressureRecordUseCase'
import { EditBloodPressureRecordUseCase } from './application/record/EditBloodPressureRecordUseCase'
import { BloodSugarRecordRepository } from './infrastructure/entities/records/BloodSugarRecordRepository'
import { CreateBloodSugarRecordUseCase } from './application/record/CreateBloodSugarRecordUseCase'
import { EditBloodSugarRecordUseCase } from './application/record/EditBloodSugarRecordUseCase'
import { FoodRecordRepository } from './infrastructure/entities/records/FoodRecordRepository'
import { CreateFoodRecordUseCase } from './application/record/CreateFoodRecordUseCase'
import { EditFoodRecordUseCase } from './application/record/EditFoodRecordUseCase'
import { ExerciseRecordRepository } from './infrastructure/entities/records/ExerciseRecordRepository'
import { CreateExerciseRecordUseCase } from './application/record/CreateExerciseRecordUseCase'
import { EditExerciseRecordUseCase } from './application/record/EditExerciseRecordUseCase'
import { SleepRecordRepository } from './infrastructure/entities/records/SleepRecordRepository'
import { CreateSleepRecordUseCase } from './application/record/CreateSleepRecordUseCase'
import { EditSleepRecordUseCase } from './application/record/EditSleepRecordUseCase'
import { WeightRecordRepository } from './infrastructure/entities/records/WeightRecordRepository'
import { CreateWeightRecordUseCase } from './application/record/CreateWeightRecordUseCase'
import { EditWeightRecordUseCase } from './application/record/EditWeightRecordUseCase'
import { GlycatedHemoglobinRecordRepository } from './infrastructure/entities/records/GlycatedHemoglobinRecordRepository'
import { CreateGlycatedHemoglobinRecordUseCase } from './application/record/CreateGlycatedHemoglobinRecordUseCase'
import { EditGlycatedHemoglobinRecordUseCase } from './application/record/EditGlycatedHemoglobinRecordUseCase'
import { RecordController } from './infrastructure/http/controllers/RecordController'

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
  /**
   * Patient Domain
   */
  const patientRepository = new PatientRepository(dataSource)
  const createPatientProfileUseCase = new CreatePatientProfileUseCase(
    patientRepository,
    uuidService
  )
  const editPatientProfileUseCase = new EditPatientProfileUseCase(
    patientRepository
  )

  /**
   * Record Domain
   */
  const bloodPressureRecordRepository = new BloodPressureRecordRepository(
    dataSource
  )
  const createBloodPressureRecordUseCase = new CreateBloodPressureRecordUseCase(
    bloodPressureRecordRepository,
    patientRepository,
    uuidService
  )
  const editBloodPressureRecordUseCase = new EditBloodPressureRecordUseCase(
    bloodPressureRecordRepository,
    patientRepository
  )
  const bloodSugarRecordRepository = new BloodSugarRecordRepository(dataSource)
  const createBloodSugarRecordUseCase = new CreateBloodSugarRecordUseCase(
    bloodSugarRecordRepository,
    patientRepository,
    uuidService
  )
  const editBloodSugarRecordUseCase = new EditBloodSugarRecordUseCase(
    bloodSugarRecordRepository,
    patientRepository
  )
  const foodRecordRepository = new FoodRecordRepository(dataSource)
  const createFoodRecordUseCase = new CreateFoodRecordUseCase(
    foodRecordRepository,
    patientRepository,
    uuidService
  )
  const editFoodRecordUseCase = new EditFoodRecordUseCase(
    foodRecordRepository,
    patientRepository
  )
  const exerciseRecordRepository = new ExerciseRecordRepository(dataSource)
  const createExerciseRecordUseCase = new CreateExerciseRecordUseCase(
    exerciseRecordRepository,
    patientRepository,
    uuidService
  )
  const editExerciseRecordUseCase = new EditExerciseRecordUseCase(
    exerciseRecordRepository,
    patientRepository
  )
  const sleepRecordRepository = new SleepRecordRepository(dataSource)
  const createSleepRecordUseCase = new CreateSleepRecordUseCase(
    sleepRecordRepository,
    patientRepository,
    uuidService
  )
  const editSleepRecordUseCase = new EditSleepRecordUseCase(
    sleepRecordRepository,
    patientRepository
  )
  const weightRepository = new WeightRecordRepository(dataSource)
  const createWeightRecordUseCase = new CreateWeightRecordUseCase(
    weightRepository,
    patientRepository,
    uuidService
  )
  const editWeightRecordUseCase = new EditWeightRecordUseCase(
    weightRepository,
    patientRepository
  )
  const glycatedHemoglobinRepository = new GlycatedHemoglobinRecordRepository(
    dataSource
  )
  const createGlycatedHemoglobinRecordUseCase =
    new CreateGlycatedHemoglobinRecordUseCase(
      glycatedHemoglobinRepository,
      patientRepository,
      uuidService
    )
  const editGlycatedHemoglobinRecordUseCase =
    new EditGlycatedHemoglobinRecordUseCase(
      glycatedHemoglobinRepository,
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
  const recordController = new RecordController(
    createWeightRecordUseCase,
    editWeightRecordUseCase,
    createBloodPressureRecordUseCase,
    editBloodPressureRecordUseCase,
    createBloodSugarRecordUseCase,
    editBloodSugarRecordUseCase,
    createExerciseRecordUseCase,
    editExerciseRecordUseCase,
    createFoodRecordUseCase,
    editFoodRecordUseCase,
    createGlycatedHemoglobinRecordUseCase,
    editGlycatedHemoglobinRecordUseCase,
    createSleepRecordUseCase,
    editSleepRecordUseCase
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
  const recordRoutes = new RecordRoutes(recordController)

  const mainRoutes = new MainRoutes(userRoutes, patientRoutes, recordRoutes)
  app.use('/api', mainRoutes.createRouter())

  app.use(errorHandler)

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}
