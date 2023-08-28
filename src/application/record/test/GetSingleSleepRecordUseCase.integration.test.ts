import MockDate from 'mockdate'
import { PostgresDatabase } from '../../../infrastructure/database/PostgresDatabase'
import { SleepRecordRepository } from '../../../infrastructure/entities/record/SleepRecordRepository'
import { PatientRepository } from '../../../infrastructure/entities/patient/PatientRepository'
import {
  GetSingleSleepRecordRequest,
  GetSingleSleepRecordUseCase,
} from '../GetSingleSleepRecordUseCase'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import { DoctorRepository } from '../../../infrastructure/entities/doctor/DoctorRepository'
import { ConsultAppointmentRepository } from '../../../infrastructure/entities/consultation/ConsultAppointmentRepository'
import { faker } from '@faker-js/faker'
import { UserRoleType } from '../../../domain/user/User'
import { PatientFactory } from '../../../domain/patient/test/PatientFactory'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { SleepRecordFactory } from '../../../domain/record/test/SleepRecordFactory'
import { mock } from 'jest-mock-extended'
import { IUuidService } from '../../../domain/utils/IUuidService'
// import { AuthorizationError } from '../../../infrastructure/error/AuthorizationError'
// import { NotFoundError } from '../../../infrastructure/error/NotFoundError'

describe('Integration test: GetSingleSleepRecordUseCase', () => {
  let database: PostgresDatabase
  let sleepRecordRepo: SleepRecordRepository
  let patientRepo: PatientRepository
  let doctorRepo: DoctorRepository
  let consultAppointmentRepo: ConsultAppointmentRepository
  let useCase: GetSingleSleepRecordUseCase
  let userRepo: UserRepository
  const mockUuidService = mock<IUuidService>()

  beforeAll(async () => {
    // connect to test db
    database = await PostgresDatabase.getInstance()
    // create repos and service
    userRepo = new UserRepository(database.getDataSource())
    patientRepo = new PatientRepository(database.getDataSource())
    doctorRepo = new DoctorRepository(database.getDataSource())
    sleepRecordRepo = new SleepRecordRepository(database.getDataSource())
    consultAppointmentRepo = new ConsultAppointmentRepository(
      database.getDataSource()
    )
    useCase = new GetSingleSleepRecordUseCase(
      sleepRecordRepo,
      patientRepo,
      doctorRepo,
      consultAppointmentRepo
    )
  }, 300000)

  beforeEach(async () => {})

  afterEach(async () => {
    // clear data in the table which had inserted data in the test
    await consultAppointmentRepo.clear()
    await sleepRecordRepo.clear()
    await patientRepo.clear()
    await doctorRepo.clear()
    await userRepo.clear()
    // reset mock
    mockUuidService.generateUuid.mockReset()
    MockDate.reset()
  })

  afterAll(async () => {
    await database.disconnect()
  })

  const mockTargetSleepRecordId = 'ef6cecbe-e490-47de-84ef-547d3655dee3'
  mockUuidService.generateUuid.mockReturnValueOnce(mockTargetSleepRecordId)
  const mockDateString = '2023-06-20T05:48:55.694Z'

  it('should get correct record data', async () => {
    const mockUser = UserFactory.build({
      id: faker.string.uuid(),
      email: 'test@test.com',
      displayName: 'Test User',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })
    await userRepo.save(mockUser)
    const mockPatient = PatientFactory.build({
      user: mockUser,
    })
    await patientRepo.save(mockPatient)

    const mockSleepRecord = SleepRecordFactory.build({
      id: mockTargetSleepRecordId,
      sleepDate: new Date('2023-06-18T13:18:00.155Z'),
      sleepTime: new Date('2023-06-18T23:00:00.155Z'),
      wakeUpTime: new Date('2023-06-19T08:30:00.155Z'),
      sleepDurationHour: parseFloat('9.5'),
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
      patientId: mockPatient.id,
    })
    await sleepRecordRepo.save(mockSleepRecord)

    MockDate.set(mockDateString)

    const request: GetSingleSleepRecordRequest = {
      user: mockUser,
      sleepRecordId: mockTargetSleepRecordId,
      targetPatientId: mockUser.id,
    }
    const result = await useCase.execute(request)

    const expected = {
      data: {
        sleepDate: mockSleepRecord.sleepDate,
        sleepTime: mockSleepRecord.sleepTime,
        wakeUpTime: mockSleepRecord.wakeUpTime,
        sleepQuality: mockSleepRecord.sleepQuality,
        sleepDurationHour: mockSleepRecord.sleepDurationHour,
        sleepNote: mockSleepRecord.sleepNote,
        createdAt: mockSleepRecord.createdAt,
        updatedAt: mockSleepRecord.updatedAt,
      },
      recordOwner: {
        firstName: mockPatient.firstName,
        lastName: mockPatient.lastName,
        birthDate: mockPatient.birthDate,
        gender: mockPatient.gender,
      },
    }
    expect(result).toEqual(expected)
  })
  // it('should throw NotFoundError if this record not found in DB', async () => {
  //   const mockUser = UserFactory.build({
  //     id: faker.string.uuid(),
  //     email: 'test@test.com',
  //     displayName: 'Test User',
  //     role: UserRoleType.PATIENT,
  //     hashedPassword: 'hashedPassword',
  //     createdAt: new Date(mockDateString),
  //     updatedAt: new Date(mockDateString),
  //   })
  //   await userRepo.save(mockUser)
  //   const mockPatient = PatientFactory.build({
  //     user: mockUser,
  //   })
  //   await patientRepo.save(mockPatient)

  //   const request: GetSingleSleepRecordRequest = {
  //     user: mockUser,
  //     sleepRecordId: 'e83fbbcf-b326-4e02-b765-9301ad3ba4f9',
  //   }
  //   await expect(useCase.execute(request)).rejects.toThrow(NotFoundError)
  // })
  //   it('should throw AuthorizationError if current doctor not found in DB', async () => {
  // })
})
