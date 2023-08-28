import { faker } from '@faker-js/faker'
import {
  GetUserAccountRequest,
  GetUserAccountUseCase,
} from '../GetUserAccountUseCase'
import { PostgresDatabase } from '../../../infrastructure/database/PostgresDatabase'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { UserRoleType } from '../../../domain/user/User'

describe('Integration test: GetUserUseCase', () => {
  let database: PostgresDatabase
  let userRepo: UserRepository

  beforeAll(async () => {
    // connect to test db
    database = await PostgresDatabase.getInstance()
    // create user repo
    userRepo = new UserRepository(database.getDataSource())
  }, 300000)

  beforeEach(async () => {})

  afterEach(async () => {
    // clear data in the table which had inserted data in the test
    await userRepo.clear()
  })

  afterAll(async () => {
    await database.disconnect()
  })

  it('should get correct user data', async () => {
    const uuid = faker.string.uuid()
    const user = UserFactory.build({
      id: uuid,
      displayName: 'test',
      email: 'test@gmail.com',
      role: UserRoleType.PATIENT,
      createdAt: new Date('2023-07-01T05:48:55.694Z'),
      updatedAt: new Date('2023-07-01T05:48:55.694Z'),
    })
    await userRepo.save(user)

    const useCase = new GetUserAccountUseCase(userRepo)
    const request: GetUserAccountRequest = {
      user,
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
