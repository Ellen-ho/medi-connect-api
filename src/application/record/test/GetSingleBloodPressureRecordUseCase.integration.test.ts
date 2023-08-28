import { mock } from 'jest-mock-extended'
import { PostgresDatabase } from '../../../infrastructure/database/PostgresDatabase'
import { ConsultAppointmentRepository } from '../../../infrastructure/entities/consultation/ConsultAppointmentRepository'
import { DoctorRepository } from '../../../infrastructure/entities/doctor/DoctorRepository'
import { PatientRepository } from '../../../infrastructure/entities/patient/PatientRepository'
import { BloodPressureRecordRepository } from '../../../infrastructure/entities/record/BloodPressureRecordRepository'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import {
  GetSingleBloodPressureRecordRequest,
  GetSingleBloodPressureRecordUseCase,
} from '../GetSingleBloodPressureRecordUsecase'
import { IUuidService } from '../../../domain/utils/IUuidService'
import MockDate from 'mockdate'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { UserRoleType } from '../../../domain/user/User'
import { PatientFactory } from '../../../domain/patient/test/PatientFactory'
import { faker } from '@faker-js/faker'
import { BloodPressureRecordFactory } from '../../../domain/record/test/BloodPressureRecordFactory'
import { NotFoundError } from '../../../infrastructure/error/NotFoundError'
import { AuthorizationError } from '../../../infrastructure/error/AuthorizationError'
import { DoctorFactory } from '../../../domain/doctor/test/DoctorFactory'

describe('Integration test: GetSingleBloodPressureRecordUseCase', () => {
  let database: PostgresDatabase
  let bloodPressureRecordRepo: BloodPressureRecordRepository
  let patientRepo: PatientRepository
  let doctorRepo: DoctorRepository
  let consultAppointmentRepo: ConsultAppointmentRepository
  let useCase: GetSingleBloodPressureRecordUseCase
  let userRepo: UserRepository
  const mockUuidService = mock<IUuidService>()

  beforeAll(async () => {
    // connect to test db
    database = await PostgresDatabase.getInstance()
    // create repos and service
    bloodPressureRecordRepo = new BloodPressureRecordRepository(
      database.getDataSource()
    )
    patientRepo = new PatientRepository(database.getDataSource())
    doctorRepo = new DoctorRepository(database.getDataSource())
    consultAppointmentRepo = new ConsultAppointmentRepository(
      database.getDataSource()
    )
    userRepo = new UserRepository(database.getDataSource())

    useCase = new GetSingleBloodPressureRecordUseCase(
      bloodPressureRecordRepo,
      patientRepo,
      doctorRepo,
      consultAppointmentRepo
    )
  }, 300000)

  beforeEach(async () => {})

  afterEach(async () => {
    // clear data in the table which had inserted data in the test
    await bloodPressureRecordRepo.clear()
    await consultAppointmentRepo.clear()
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

  const mockTargetBloodPressureRecordId = '6bf99644-a812-45be-9c59-ddcf006c9e94'
  mockUuidService.generateUuid.mockReturnValueOnce(
    mockTargetBloodPressureRecordId
  )
  const mockDateString = '2023-06-18T05:48:55.694Z'

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

    const mockBloodPressureRecord = BloodPressureRecordFactory.build({
      id: mockTargetBloodPressureRecordId,
      bloodPressureDate: new Date(mockDateString),
      systolicBloodPressure: 130,
      diastolicBloodPressure: 90,
      heartBeat: 78,
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
      patientId: mockPatient.id,
    })
    await bloodPressureRecordRepo.save(mockBloodPressureRecord)

    const request: GetSingleBloodPressureRecordRequest = {
      user: mockUser,
      bloodPressureRecordId: mockTargetBloodPressureRecordId,
      targetPatientId: mockPatient.id,
    }
    const result = await useCase.execute(request)

    const expected = {
      data: {
        bloodPressureDate: mockBloodPressureRecord.bloodPressureDate,
        systolicBloodPressure: mockBloodPressureRecord.systolicBloodPressure,
        diastolicBloodPressure: mockBloodPressureRecord.diastolicBloodPressure,
        heartBeat: mockBloodPressureRecord.heartBeat,
        bloodPressureNote: mockBloodPressureRecord.bloodPressureNote,
        createdAt: mockBloodPressureRecord.createdAt,
        updatedAt: mockBloodPressureRecord.updatedAt,
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
  it('should throw NotFoundError if this record not  found in DB', async () => {
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

    const request: GetSingleBloodPressureRecordRequest = {
      user: mockUser,
      bloodPressureRecordId: '532b4a37-cc5c-4193-9a9b-f2789102f3f9',
      targetPatientId: mockPatient.id,
    }
    await expect(useCase.execute(request)).rejects.toThrow(NotFoundError)
  })
  it('should throw AuthorizationError if current doctor not found in DB', async () => {
    const mockUser = UserFactory.build({
      id: faker.string.uuid(),
      email: 'test@test.com',
      displayName: 'Test User',
      role: UserRoleType.DOCTOR,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })

    const mockUser2 = UserFactory.build({
      id: faker.string.uuid(),
      email: 'test2@test.com',
      displayName: 'Test User2',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })
    await userRepo.save(mockUser2)
    const mockPatient2 = PatientFactory.build({
      user: mockUser2,
    })
    await patientRepo.save(mockPatient2)
    await userRepo.save(mockUser)
    const mockBloodPressureRecord = BloodPressureRecordFactory.build({
      id: mockTargetBloodPressureRecordId,
      bloodPressureDate: new Date(mockDateString),
      systolicBloodPressure: 130,
      diastolicBloodPressure: 90,
      heartBeat: 78,
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
      patientId: mockPatient2.id,
    })
    await bloodPressureRecordRepo.save(mockBloodPressureRecord)

    const request: GetSingleBloodPressureRecordRequest = {
      user: mockUser,
      bloodPressureRecordId: mockTargetBloodPressureRecordId,
      targetPatientId: mockPatient2.id,
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })
  it('should throw AuthorizationError if no upcoming appointments found in DB', async () => {
    const mockPatientUser = UserFactory.build({
      id: 'a1060d41-c9d0-4c31-8e22-d3b4f1be93a3',
      email: 'patient@test.com',
      displayName: 'Test Patient',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })
    await userRepo.save(mockPatientUser)
    const mockPatient = PatientFactory.build({
      user: mockPatientUser,
    })
    await patientRepo.save(mockPatient)
    const mockDoctorUser = UserFactory.build({
      id: '37cb7ba7-19c5-4cba-8d4f-d976a2b1963e',
      email: 'doctor@test.com',
      displayName: 'Test Doctor',
      role: UserRoleType.DOCTOR,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })
    await userRepo.save(mockDoctorUser)
    const mockDoctor = DoctorFactory.build({
      user: mockDoctorUser,
    })
    await doctorRepo.save(mockDoctor)
    const mockBloodPressureRecord = BloodPressureRecordFactory.build({
      id: mockTargetBloodPressureRecordId,
      bloodPressureDate: new Date(mockDateString),
      systolicBloodPressure: 130,
      diastolicBloodPressure: 90,
      heartBeat: 78,
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
      patientId: mockPatient.id,
    })
    await bloodPressureRecordRepo.save(mockBloodPressureRecord)

    const request: GetSingleBloodPressureRecordRequest = {
      user: mockDoctorUser,
      bloodPressureRecordId: mockTargetBloodPressureRecordId,
      targetPatientId: mockPatient.id,
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })
  it('should throw AuthorizationError if patient who made appointment not found', async () => {
    const mockUser = UserFactory.build({
      id: faker.string.uuid(),
      email: 'test@test.com',
      displayName: 'Test User',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })
    const mockDoctorUser = UserFactory.build({
      id: '37cb7ba7-19c5-4cba-8d4f-d976a2b1963e',
      email: 'doctor@test.com',
      displayName: 'Test Doctor',
      role: UserRoleType.DOCTOR,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })
    await userRepo.save(mockDoctorUser)
    const mockDoctor = DoctorFactory.build({
      user: mockDoctorUser,
    })
    await doctorRepo.save(mockDoctor)
    const mockUser2 = UserFactory.build({
      id: faker.string.uuid(),
      email: 'test2@test.com',
      displayName: 'Test User2',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })
    await userRepo.save(mockUser2)
    const mockPatient2 = PatientFactory.build({
      user: mockUser2,
    })
    await patientRepo.save(mockPatient2)
    await userRepo.save(mockUser)
    const mockBloodPressureRecord = BloodPressureRecordFactory.build({
      id: mockTargetBloodPressureRecordId,
      bloodPressureDate: new Date(mockDateString),
      systolicBloodPressure: 130,
      diastolicBloodPressure: 90,
      heartBeat: 78,
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
      patientId: mockPatient2.id,
    })
    await bloodPressureRecordRepo.save(mockBloodPressureRecord)
    const request: GetSingleBloodPressureRecordRequest = {
      user: mockUser,
      bloodPressureRecordId: mockTargetBloodPressureRecordId,
      targetPatientId: mockPatient2.id,
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })
  it('should throw AuthorizationError if the current patient does not exist', async () => {
    const mockUser = UserFactory.build({
      id: faker.string.uuid(),
      email: 'test@test.com',
      displayName: 'Test User',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })

    const mockUser2 = UserFactory.build({
      id: faker.string.uuid(),
      email: 'test2@test.com',
      displayName: 'Test User2',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })
    await userRepo.save(mockUser2)
    const mockPatient2 = PatientFactory.build({
      user: mockUser2,
    })
    await patientRepo.save(mockPatient2)
    await userRepo.save(mockUser)
    const mockBloodPressureRecord = BloodPressureRecordFactory.build({
      id: mockTargetBloodPressureRecordId,
      bloodPressureDate: new Date(mockDateString),
      systolicBloodPressure: 130,
      diastolicBloodPressure: 90,
      heartBeat: 78,
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
      patientId: mockPatient2.id,
    })
    await bloodPressureRecordRepo.save(mockBloodPressureRecord)

    const request: GetSingleBloodPressureRecordRequest = {
      user: mockUser,
      bloodPressureRecordId: mockTargetBloodPressureRecordId,
      targetPatientId: mockPatient2.id,
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })
  it('should throw AuthorizationError if the record does not belong to the current patient', async () => {
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

    const mockUser2 = UserFactory.build({
      id: faker.string.uuid(),
      email: 'test2@test.com',
      displayName: 'Test User2',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
    })
    await userRepo.save(mockUser2)
    const mockPatient2 = PatientFactory.build({
      user: mockUser2,
    })
    await userRepo.save(mockUser2)
    await patientRepo.save(mockPatient2)
    const mockBloodPressureRecord = BloodPressureRecordFactory.build({
      id: mockTargetBloodPressureRecordId,
      bloodPressureDate: new Date(mockDateString),
      systolicBloodPressure: 130,
      diastolicBloodPressure: 90,
      heartBeat: 78,
      createdAt: new Date(mockDateString),
      updatedAt: new Date(mockDateString),
      patientId: mockPatient2.id,
    })
    await bloodPressureRecordRepo.save(mockBloodPressureRecord)

    const request: GetSingleBloodPressureRecordRequest = {
      user: mockUser,
      bloodPressureRecordId: mockTargetBloodPressureRecordId,
      targetPatientId: mockPatient2.id,
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })
})
