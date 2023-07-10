import { mock } from 'jest-mock-extended'
import { PostgresDatabase } from '../../../infrastructure/database/PostgresDatabase'
import { PatientRepository } from '../../../infrastructure/entities/patient/PatientRepository'
import { ExerciseRecordRepository } from '../../../infrastructure/entities/record/ExerciseRecordRepository'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import {
  CreateExerciseRecordRequest,
  CreateExerciseRecordUseCase,
} from '../CreateExerciseRecordUseCase'
import { IUuidService } from '../../../domain/utils/IUuidService'
import MockDate from 'mockdate'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { faker } from '@faker-js/faker'
import { UserRoleType } from '../../../domain/user/User'
import { PatientFactory } from '../../../domain/patient/test/PatientFactory'
import {
  ExerciseType,
  IntensityType,
} from '../../../domain/record/ExerciseRecord'
import { AuthorizationError } from '../../../infrastructure/error/AuthorizationError'

describe('Integration test: CreateExerciseRecordUseCase', () => {
  let database: PostgresDatabase
  let exerciseRecordRepo: ExerciseRecordRepository
  let patientRepo: PatientRepository
  let useCase: CreateExerciseRecordUseCase
  let userRepo: UserRepository
  // mock for predfined uuid
  const mockUuidService = mock<IUuidService>()

  beforeAll(async () => {
    // connect to test db
    database = new PostgresDatabase()
    await database.connect()
    // create repos and service
    exerciseRecordRepo = new ExerciseRecordRepository(database.getDataSource())
    patientRepo = new PatientRepository(database.getDataSource())
    userRepo = new UserRepository(database.getDataSource())

    useCase = new CreateExerciseRecordUseCase(
      exerciseRecordRepo,
      patientRepo,
      mockUuidService
    )
  }, 300000)

  beforeEach(async () => {})

  afterEach(async () => {
    // clear data in the table which had inserted data in the test
    await exerciseRecordRepo.clear()
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

  it('should create correct exercise record data', async () => {
    await userRepo.save(mockUser)

    const mockPatient = PatientFactory.build({
      user: mockUser,
    })
    await patientRepo.save(mockPatient)
    const mockTargetBloodSugarRecordId = '80817bc2-6172-4540-bad5-17aff18b6f89'
    mockUuidService.generateUuid.mockReturnValueOnce(
      mockTargetBloodSugarRecordId
    )
    const mockDateString = '2023-07-01T05:48:55.694Z'
    MockDate.set(mockDateString)

    /**
     * start execute use case
     */
    const request: CreateExerciseRecordRequest = {
      user: mockUser,
      exerciseDate: new Date('2023-07-01T05:48:55.694Z'),
      exerciseType: ExerciseType.AEROBIC_EXERCISE,
      exerciseDurationMinute: 30,
      exerciseIntensity: IntensityType.HIGH,
      exerciseNote: 'Be tired today.',
    }
    const result = await useCase.execute(request)
    const expected = {
      id: mockTargetBloodSugarRecordId,
      exerciseDate: new Date('2023-07-01T05:48:55.694Z'),
      exerciseType: ExerciseType.AEROBIC_EXERCISE,
      exerciseDurationMinute: 30,
      exerciseIntensity: IntensityType.HIGH,
      kcaloriesBurned: 198,
      exerciseNote: 'Be tired today.',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    }
    expect(result).toEqual(expected)
  })
  it('should throw AuthorizationError if no patient found in DB', async () => {
    await userRepo.save(mockUser)
    const request: CreateExerciseRecordRequest = {
      user: mockUser,
      exerciseDate: new Date('2023-07-01T05:48:55.694Z'),
      exerciseType: ExerciseType.AEROBIC_EXERCISE,
      exerciseDurationMinute: 30,
      exerciseIntensity: IntensityType.HIGH,
      exerciseNote: 'Be tired today.',
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })
})
