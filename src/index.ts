import 'reflect-metadata'
import express, { Express } from 'express'
import dotenv from 'dotenv'
import { PostgresDatabase } from './infrastructure/database/PostgresDatabase'
import { UuidService } from './infrastructure/utils/UuidService'
import { UserRepository } from './infrastructure/entities/user/UserRepository'
import { GetUser } from './application/user/GetUser'
import { CreateUser } from './application/user/CreateUser'
import { UserController } from './infrastructure/http/controllers/UserController'
import { UserRoutes } from './infrastructure/http/routes/UserRoutes'
import { MainRoutes } from './infrastructure/http/routes'
import { errorHandler } from './infrastructure/http/middlewares/ErrorHandler'
import { BcryptHashGenerator } from './infrastructure/utils/BcryptHashGenerator'
import { PassportConfig } from './infrastructure/config/passportConfig'
import passport from 'passport'
import { User } from './domain/user/User'
import jwt from 'jsonwebtoken'

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
  const getUser = new GetUser(userRepository)
  const createUser = new CreateUser(userRepository, uuidService, hashGenerator)
  const userController = new UserController(getUser, createUser)

  const app: Express = express()
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  // eslint-disable-next-line no-new
  new PassportConfig(userRepository)

  /**
   * Routes
   */
  const userRoutes = new UserRoutes(userController)
  const mainRoutes = new MainRoutes(userRoutes)
  app.use('/api', mainRoutes.createRouter())
  app.post(
    '/api/users/login',
    passport.authenticate('local', { session: false }),
    (req, res, next) => {
      try {
        const { id, email, createdAt, displayName } = req.user as User

        const token = jwt.sign({ id, email }, env.JWT_SECRET as string, {
          expiresIn: '30d',
        })
        res.json({
          token,
          user: { id, createdAt, displayName },
        })
      } catch (err) {
        next(err)
      }
    }
  )
  app.use(errorHandler)

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}
