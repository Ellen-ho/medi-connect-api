import MockDate from 'mockdate'
import { PostgresDatabase } from '../../../infrastructure/database/PostgresDatabase'
import { WeightRecordRepository } from '../../../infrastructure/entities/record/WeightRecordRepository'
import { PatientRepository } from '../../../infrastructure/entities/patient/PatientRepository'
import { PatientFactory } from '../../../domain/patient/test/PatientFactory'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { faker } from '@faker-js/faker'
import { UserRoleType } from '../../../domain/user/User'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import {
  EditWeightRecordRequest,
  EditWeightRecordUseCase,
} from '../EditWeightRecordUseCase'
import { AuthorizationError } from '../../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../../infrastructure/error/ValidationError'
import { WeightRecordFactory } from '../../../domain/record/test/WeightRecordFactory'

describe('Integration test: EditWeightRecordUseCase', () => {
  let database: PostgresDatabase
  let weightRecordRepo: WeightRecordRepository
  let patientRepo: PatientRepository
  let useCase: EditWeightRecordUseCase
  let userRepo: UserRepository

  beforeAll(async () => {
    // connect to test db
    database = new PostgresDatabase()
    await database.connect()
    // create repos and service
    weightRecordRepo = new WeightRecordRepository(database.getDataSource())
    patientRepo = new PatientRepository(database.getDataSource())
    userRepo = new UserRepository(database.getDataSource())

    useCase = new EditWeightRecordUseCase(weightRecordRepo, patientRepo)
  }, 300000)

  beforeEach(async () => {})

  afterEach(async () => {
    // clear data in the table which had inserted data in the test
    await weightRecordRepo.clear()
    await patientRepo.clear()
    await userRepo.clear()
    // reset mock
    MockDate.reset()
  })

  afterAll(async () => {
    await database.disconnect()
  })

  const mockUser = UserFactory.build({
    id: faker.string.uuid(),
    email: 'test@test.com',
    displayName: 'Test User',
    role: UserRoleType.PATIENT,
    hashedPassword: 'hashedPassword',
    createdAt: new Date('2023-06-18T13:18:00.155Z'),
    updatedAt: new Date('2023-06-18T13:18:00.155Z'),
  })

  const mockExtingWeightRecordId = '7bbad866-41b3-4dbe-81eb-dd8f9222ff10'

  it('should edit correct weight record data', async () => {
    await userRepo.save(mockUser)
    const mockPatient = PatientFactory.build({
      user: mockUser,
    })
    await patientRepo.save(mockPatient)

    const mockWeightRecord = WeightRecordFactory.build({
      id: mockExtingWeightRecordId,
      patientId: mockPatient.id,
    })
    await weightRecordRepo.save(mockWeightRecord)

    const mockDateString = '2023-07-01T05:48:55.694Z'
    MockDate.set(mockDateString)

    const request: EditWeightRecordRequest = {
      user: mockUser,
      weightRecordId: mockExtingWeightRecordId,
      weightDate: new Date('2023-07-01T05:48:55.694Z'),
      weightValueKg: 97,
      weightNote: null,
    }

    const result = await useCase.execute(request)
    const expected = {
      id: mockExtingWeightRecordId,
      weightDate: new Date('2023-07-01T05:48:55.694Z'),
      weightValueKg: 98,
      bodyMassIndex: 30.24,
      weightNote: 'Keep going.',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    }
    expect(result).toEqual(expected)
  })

  it('should throw AuthorizationError if no patient found in DB', async () => {
    const request: EditWeightRecordRequest = {
      user: mockUser,
      weightRecordId: mockExtingWeightRecordId,
      weightDate: new Date('2023-07-01T05:48:55.694Z'),
      weightValueKg: 98,
      weightNote: 'Keep going.',
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })
  it('should throw NotFoundError if this weight record does not exist', async () => {
    await userRepo.save(mockUser)
    const mockPatient = PatientFactory.build({
      user: mockUser,
    })
    await patientRepo.save(mockPatient)

    const request: EditWeightRecordRequest = {
      user: mockUser,
      weightRecordId: '9ed019bf-b71e-458d-ba95-4eca34d4f744',
      weightDate: new Date('2023-07-01T05:48:55.694Z'),
      weightValueKg: 98,
      weightNote: 'Keep going.',
    }

    await expect(useCase.execute(request)).rejects.toThrow(NotFoundError)
  })
  it('should throw ValidationError if this weight record has already exist', async () => {
    await userRepo.save(mockUser)
    const mockPatient = PatientFactory.build({
      user: mockUser,
    })
    await patientRepo.save(mockPatient)

    const existingWeightRecord = WeightRecordFactory.build({
      id: mockExtingWeightRecordId,
      weightDate: new Date('2023-07-01T05:48:55.694Z'),
      weightValueKg: 98,
      bodyMassIndex: 30.24,
      weightNote: 'Keep going.',
      patientId: mockPatient.id,
    })
    await weightRecordRepo.save(existingWeightRecord)

    /**
     * start execute use case
     */
    const request: EditWeightRecordRequest = {
      user: mockUser,
      weightRecordId: '7bbad866-41b3-4dbe-81eb-dd8f9222ff10',
      weightDate: new Date('2023-07-01T05:48:55.694Z'),
      weightValueKg: 98,
      weightNote: 'Keep going.',
    }

    await expect(useCase.execute(request)).rejects.toThrow(ValidationError)
  })
})
