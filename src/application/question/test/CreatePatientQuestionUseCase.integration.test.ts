import { mock } from 'jest-mock-extended'
import { PostgresDatabase } from '../../../infrastructure/database/PostgresDatabase'
import { PatientRepository } from '../../../infrastructure/entities/patient/PatientRepository'
import { PatientQuestionRepository } from '../../../infrastructure/entities/question/PatientQuestionRepository'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import {
  CreatePatientQuestionRequest,
  CreatePatientQuestionUseCase,
} from '../CreatePatientQuestionUseCase'
import { IUuidService } from '../../../domain/utils/IUuidService'
import MockDate from 'mockdate'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { UserRoleType } from '../../../domain/user/User'
import { faker } from '@faker-js/faker'
import { PatientFactory } from '../../../domain/patient/test/PatientFactory'
import { MedicalSpecialtyType } from '../../../domain/question/PatientQuestion'
import { AuthorizationError } from '../../../infrastructure/error/AuthorizationError'

describe('Integration test: CreatePatientQuestionUseCase', () => {
  let database: PostgresDatabase
  let patientQuestionRepo: PatientQuestionRepository
  let patientRepo: PatientRepository
  let useCase: CreatePatientQuestionUseCase
  let userRepo: UserRepository
  // mock for predfined uuid
  const mockUuidService = mock<IUuidService>()

  beforeAll(async () => {
    // connect to test db
    database = new PostgresDatabase()
    await database.connect()
    // create repos and service
    patientQuestionRepo = new PatientQuestionRepository(
      database.getDataSource()
    )
    patientRepo = new PatientRepository(database.getDataSource())
    userRepo = new UserRepository(database.getDataSource())

    useCase = new CreatePatientQuestionUseCase(
      patientQuestionRepo,
      patientRepo,
      mockUuidService
    )
  }, 300000)

  beforeEach(async () => {})

  afterEach(async () => {
    // clear data in the table which had inserted data in the test
    await patientQuestionRepo.clear()
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

  it('should create correct patient question data', async () => {
    await userRepo.save(mockUser)

    const mockPatient = PatientFactory.build({
      user: mockUser,
    })
    await patientRepo.save(mockPatient)

    const request: CreatePatientQuestionRequest = {
      user: mockUser,
      content: 'How can I do when I get a cold?',
      medicalSpecialty: MedicalSpecialtyType.INTERNAL_MEDICINE,
    }

    const mockTargetPatientQuestionId = '37717e67-72ed-43fd-971e-d50917c14e3a'
    mockUuidService.generateUuid.mockReturnValueOnce(
      mockTargetPatientQuestionId
    )
    const mockDateString = '2023-07-02T05:48:55.694Z'
    MockDate.set(mockDateString)

    const result = await useCase.execute(request)
    const expected = {
      id: mockTargetPatientQuestionId,
      content: 'How can I do when I get a cold?',
      medicalSpecialty: MedicalSpecialtyType.INTERNAL_MEDICINE,
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    }
    expect(result).toEqual(expected)
  })
  it('should throw AuthorizationError if no patient found in DB', async () => {
    await userRepo.save(mockUser)
    const request: CreatePatientQuestionRequest = {
      user: mockUser,
      content: 'How can I do when I get a cold?',
      medicalSpecialty: MedicalSpecialtyType.INTERNAL_MEDICINE,
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })
})
