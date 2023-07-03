import { faker } from '@faker-js/faker'
import { IUuidService } from '../../../domain/utils/IUuidService'
import { PostgresDatabase } from '../../../infrastructure/database/PostgresDatabase'
import { PatientRepository } from '../../../infrastructure/entities/patient/PatientRepository'
import { BloodSugarRecordRepository } from '../../../infrastructure/entities/record/BloodSugarRecordRepository'
import { BloodSugarRecordFactory } from '../../../domain/record/test/BloodSugarRecordFactory'
import { BloodSugarType } from '../../../domain/record/BloodSugarRecord'
import {
  CreateBloodSugarRecordRequest,
  CreateBloodSugarRecordUseCase,
} from '../CreateBloodSugarRecordUseCase'
import { UserRoleType } from '../../../domain/user/User'
import { AuthorizationError } from '../../../infrastructure/error/AuthorizationError'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { PatientFactory } from '../../../domain/patient/test/PatientFactory'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import { ValidationError } from '../../../infrastructure/error/ValidationError'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

describe('Integration test: CreateBloodSugarRecordUseCase', () => {
  let database: PostgresDatabase
  let bloodSugarRecordRepo: BloodSugarRecordRepository
  let patientRepo: PatientRepository
  let useCase: CreateBloodSugarRecordUseCase
  let userRepo: UserRepository
  // mock for predfined uuid
  const mockUuidService = mock<IUuidService>()

  beforeAll(async () => {
    // connect to test db
    database = new PostgresDatabase()
    await database.connect()
    // create repos and service
    bloodSugarRecordRepo = new BloodSugarRecordRepository(
      database.getDataSource()
    )
    patientRepo = new PatientRepository(database.getDataSource())
    userRepo = new UserRepository(database.getDataSource())

    useCase = new CreateBloodSugarRecordUseCase(
      bloodSugarRecordRepo,
      patientRepo,
      mockUuidService
    )
  }, 300000)

  beforeEach(async () => {})

  afterEach(async () => {
    // clear data in the table which had inserted data in the test
    await bloodSugarRecordRepo.clear()
    await patientRepo.clear()
    await userRepo.clear()
    // reset mock
    mockUuidService.generateUuid.mockReset()
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

  it('should create correct blood sugar record data', async () => {
    /**
     * Prepare data and save into DB
     */
    // save mock into DB in the following order: user -> patient
    await userRepo.save(mockUser)

    const mockPatient = PatientFactory.build({
      user: mockUser,
    })
    await patientRepo.save(mockPatient)

    /**
     * mock neccussary service if needed
     */
    const mockTargetBloodSugarRecordId = '65a483ce-b0f7-4825-8054-2aa216b0c7c8'
    mockUuidService.generateUuid.mockReturnValueOnce(
      mockTargetBloodSugarRecordId
    )
    const mockDateString = '2023-07-02T05:48:55.694Z'
    MockDate.set(mockDateString)

    /**
     * start execute use case
     */
    const request: CreateBloodSugarRecordRequest = {
      user: mockUser,
      bloodSugarDate: new Date('2023-07-01T05:48:55.694Z'),
      bloodSugarValue: 98,
      bloodSugarNote: 'Eat too much bread today.',
    }
    const result = await useCase.execute(request)
    const expected = {
      id: mockTargetBloodSugarRecordId,
      bloodSugarDate: new Date('2023-07-01T05:48:55.694Z'),
      bloodSugarValue: 98,
      bloodSugarType: BloodSugarType.FAST_PLASMA_GLUCOSE,
      bloodSugarNote: 'Eat too much bread today.',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    }
    expect(result).toEqual(expected)
  })

  it('should throw AuthorizationError if no patient found in DB', async () => {
    /**
     * Prepare data and save into DB
     */
    await userRepo.save(mockUser)

    /**
     * start execute use case
     */
    const request: CreateBloodSugarRecordRequest = {
      user: mockUser,
      bloodSugarDate: new Date('2023-07-01T05:48:55.694Z'),
      bloodSugarValue: 98,
      bloodSugarNote: 'Eat too much bread today.',
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })

  it('should throw ValidationError if a record in the same day exists', async () => {
    /**
     * Prepare data and save into DB
     */
    // save mock into DB in the following order: user -> patient - record
    await userRepo.save(mockUser)

    const mockPatient = PatientFactory.build({
      user: mockUser,
    })
    await patientRepo.save(mockPatient)

    const existingBloodSugarRecord = BloodSugarRecordFactory.build({
      bloodSugarDate: new Date('2023-07-01T05:48:55.694Z'),
      patientId: mockPatient.id,
    })
    await bloodSugarRecordRepo.save(existingBloodSugarRecord)

    /**
     * start execute use case
     */
    const request: CreateBloodSugarRecordRequest = {
      user: mockUser,
      bloodSugarDate: new Date('2023-07-01T10:48:55.694Z'),
      bloodSugarValue: 98,
      bloodSugarNote: 'Eat too much bread today.',
    }

    await expect(useCase.execute(request)).rejects.toThrow(ValidationError)
  })
})
