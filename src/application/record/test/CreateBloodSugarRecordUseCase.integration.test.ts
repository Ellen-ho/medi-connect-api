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
import { User, UserRoleType } from '../../../domain/user/User'
import { AuthorizationError } from '../../../infrastructure/error/AuthorizationError'
import { UuidService } from '../../../infrastructure/utils/UuidService'
import { GenderType, Patient } from '../../../domain/patient/Patient'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { PatientFactory } from '../../../domain/patient/test/PatientFactory'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import { ValidationError } from '../../../infrastructure/error/ValidationError'

describe('Integration test: CreateBloodSugarRecordUseCase', () => {
  let database: PostgresDatabase
  let bloodSugarRecordRepo: BloodSugarRecordRepository
  let patientRepo: PatientRepository
  let uuidService: IUuidService
  let useCase: CreateBloodSugarRecordUseCase
  let userRepo: UserRepository

  beforeAll(async () => {
    // connect to test db
    database = new PostgresDatabase()
    await database.connect()
    // create repos and service
    bloodSugarRecordRepo = new BloodSugarRecordRepository(
      database.getDataSource()
    )
    patientRepo = new PatientRepository(database.getDataSource())
    uuidService = new UuidService()

    useCase = new CreateBloodSugarRecordUseCase(
      bloodSugarRecordRepo,
      patientRepo,
      uuidService
    )
  }, 300000)

  beforeEach(async () => {})

  afterEach(async () => {
    // clear data in the table which had inserted data in the test
    await bloodSugarRecordRepo.clear()
    await patientRepo.clear()
    await userRepo.clear()
  })

  afterAll(async () => {
    await database.disconnect()
  })

  const mockUser = UserFactory.build({
    id: '1',
    email: 'test@test.com',
    displayName: 'Test User',
    role: UserRoleType.PATIENT,
    hashedPassword: 'hashedPassword',
    createdAt: new Date('2023-06-18T13:18:00.155Z'),
    updatedAt: new Date('2023-06-18T13:18:00.155Z'),
  })

  describe('Integration test: CreateBloodSugarRecordUseCase', () => {
    let database: PostgresDatabase
    let bloodSugarRecordRepo: BloodSugarRecordRepository
    let patientRepo: PatientRepository
    let uuidService: IUuidService
    let useCase: CreateBloodSugarRecordUseCase
    let userRepo: UserRepository

    beforeAll(async () => {
      // connect to test db
      database = new PostgresDatabase()
      await database.connect()
      // create repos and service
      bloodSugarRecordRepo = new BloodSugarRecordRepository(
        database.getDataSource()
      )
      patientRepo = new PatientRepository(database.getDataSource())
      uuidService = new UuidService()

      useCase = new CreateBloodSugarRecordUseCase(
        bloodSugarRecordRepo,
        patientRepo,
        uuidService
      )

      userRepo = new UserRepository(database.getDataSource())
    }, 300000)

    beforeEach(async () => {})

    afterEach(async () => {
      // clear data in the table which had inserted data in the test
      await bloodSugarRecordRepo.clear()
      await patientRepo.clear()
      await userRepo.clear()
    })

    afterAll(async () => {
      await database.disconnect()
    })

    const mockUser = UserFactory.build({
      id: '1',
      email: 'test@test.com',
      displayName: 'Test User',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: new Date('2023-06-18T13:18:00.155Z'),
      updatedAt: new Date('2023-06-18T13:18:00.155Z'),
    })

    it('should create correct blood sugar record data', async () => {
      const uuid = faker.string.uuid()
      const bloodSugarRecord = BloodSugarRecordFactory.build({
        id: uuid,
        bloodSugarDate: new Date('2023-07-01T05:48:55.694Z'),
        bloodSugarValue: 98,
        bloodSugarType: BloodSugarType.FAST_PLASMA_GLUCOSE,
        bloodSugarNote: 'Eat too much bread today.',
        createdAt: new Date('2023-07-01T05:48:55.694Z'),
        updatedAt: new Date('2023-07-01T05:48:55.694Z'),
      })
      await bloodSugarRecordRepo.save(bloodSugarRecord)

      const mockPatient = PatientFactory.build({
        id: faker.string.uuid(),
        avatar: null,
        firstName: faker.internet.displayName(),
        lastName: faker.internet.displayName(),
        birthDate: new Date(),
        gender: GenderType.FEMALE,
        medicalHistory: null,
        allergy: {
          medicine: null,
          food: null,
          other: null,
        },
        familyHistory: null,
        heightValueCm: 180,
        medicinceUsage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: UserFactory.build(),
      })

      await patientRepo.save(mockPatient)

      const request: CreateBloodSugarRecordRequest = {
        user: mockUser,
        bloodSugarDate: new Date('2023-07-01T05:48:55.694Z'),
        bloodSugarValue: 98,
        bloodSugarNote: 'Eat too much bread today.',
      }
      const result = await useCase.execute(request)
      const expected = {
        id: uuid,
        bloodSugarDate: new Date('2023-07-01T05:48:55.694Z'),
        bloodSugarValue: 98,
        bloodSugarType: BloodSugarType.FAST_PLASMA_GLUCOSE,
        bloodSugarNote: 'Eat too much bread today.',
        createdAt: new Date('2023-07-01T05:48:55.694Z'),
        updatedAt: new Date('2023-07-01T05:48:55.694Z'),
      }
      expect(result).toEqual(expected)
    })

  it('should throw AuthorizationError if no user found in DB', async () => {
    const request: CreateBloodSugarRecordRequest = {
      user: null,
      bloodSugarDate: new Date('2023-07-01T05:48:55.694Z'),
      bloodSugarValue: 98,
      bloodSugarNote: 'Eat too much bread today.',
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })

  it('should throw ValidationError if a record in the same day exists', async () => {
    const request: CreateBloodSugarRecordRequest = {
      user: mockUser,
      bloodSugarDate: new Date('2023-07-01T05:48:55.694Z'),
      bloodSugarValue: 98,
      bloodSugarNote: 'Eat too much bread today.',
    }
    
    await expect(useCase.execute(request)).rejects.toThrow(ValidationError)

    // In this case, you can insert a record into DB and request to create a new record in the same day
  })
})
