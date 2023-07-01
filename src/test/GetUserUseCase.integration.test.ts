import { faker } from '@faker-js/faker'
import { PostgresDatabase } from '../infrastructure/database/PostgresDatabase'
import { UserRoleType } from '../domain/user/User'
import {
  GetUserRequest,
  GetUserUseCase,
} from '../application/user/GetUserUseCase'
import { UserRepository } from '../infrastructure/entities/user/UserRepository'
import { UserFactory } from '../domain/user/test/UserFactory'

describe('INTEGRATION: User Use Cases', () => {
  let database: PostgresDatabase
  let userRepo: UserRepository

  beforeAll(async () => {
    // connect to test db
    database = new PostgresDatabase()
    await database.connect()
    // create user repo
    userRepo = new UserRepository(database.getDataSource())
  }, 300000)

  afterEach(async () => {
    // clear data in the table which had inserted data in the test
    await userRepo.clear()
  })

  afterAll(async () => {
    await database.disconnect()
  })

  it('should get correct correct user data', async () => {
    const uuid = faker.string.uuid()
    const user = UserFactory.build({
      id: uuid,
      hashedPassword: 'password',
      displayName: 'test',
      email: 'test@gmail.com',
      role: UserRoleType.PATIENT,
      createdAt: new Date('2023-07-01T05:48:55.694Z'),
      updatedAt: new Date('2023-07-01T05:48:55.694Z'),
    })
    await userRepo.save(user)

    const useCase = new GetUserUseCase(userRepo)
    const request: GetUserRequest = {
      id: uuid,
    }
    const result = await useCase.execute(request)
    const expected = {
      id: uuid,
      email: 'test@gmail.com',
      displayName: 'test',
      role: UserRoleType.PATIENT,
      createdAt: new Date('2023-07-01T05:48:55.694Z'),
      updatedAt: new Date('2023-07-01T05:48:55.694Z'),
    }
    expect(result).toMatchObject(expected)
  })
})
