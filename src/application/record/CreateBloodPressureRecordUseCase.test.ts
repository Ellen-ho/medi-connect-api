import { mock } from 'jest-mock-extended'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { CreateBloodPressureRecordUseCase } from './CreateBloodPressureRecordUseCase'
import { User, UserRoleType } from '../../domain/user/User'
import { BloodPressureRecord } from '../../domain/record/BloodPressureRecord'
import { ValidationError } from '../../infrastructure/error/ValidationError'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { GenderType, Patient } from '../../domain/patient/Patient'

describe('Unit test: CreateBloodPressureRecordUseCase', () => {
  const mockBloodPressureRecordRepo = mock<IBloodPressureRecordRepository>()
  const mockPatientRepo = mock<IPatientRepository>()
  const mockUuidService = mock<IUuidService>()

  const createBloodPressureRecordUseCase = new CreateBloodPressureRecordUseCase(
    mockBloodPressureRecordRepo,
    mockPatientRepo,
    mockUuidService
  )

  const mockedDate = new Date('2023-06-18T13:18:00.155Z')
  jest.spyOn(global, 'Date').mockImplementation(() => mockedDate)

  afterEach(() => {
    jest.resetAllMocks()
  })

  const mockExistingPatient = new Patient({
    id: '1',
    avatar: null,
    firstName: 'John',
    lastName: 'Doe',
    birthDate: new Date('1990-01-01'),
    gender: GenderType.MALE,
    medicalHistory: null,
    allergy: {
      medicine: null,
      food: null,
      other: null,
    },
    familyHistory: null,
    heightValueCm: 180,
    medicineUsage: null,
    createdAt: new Date('2023-06-18T13:18:00.155Z'),
    updatedAt: new Date('2023-06-18T13:18:00.155Z'),
    user: new User({
      id: '1',
      email: 'test@test.com',
      displayName: 'Test User',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  })

  const mockRequest = {
    user: new User({
      id: '1',
      email: 'test@test.com',
      displayName: 'Test User',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: new Date('2023-06-18T13:18:00.155Z'),
      updatedAt: new Date('2023-06-18T13:18:00.155Z'),
    }),
    bloodPressureDate: new Date('2023-06-18T13:18:00.155Z'),
    systolicBloodPressure: 120,
    diastolicBloodPressure: 80,
    heartBeat: 70,
    bloodPressureNote: null,
  }

  it('should create a new blood pressure record when valid request is provided', async () => {
    const mockGeneratedUuid = 'generated-uuid'

    const mockBloodPressureRecord = new BloodPressureRecord({
      id: mockGeneratedUuid,
      bloodPressureDate: mockRequest.bloodPressureDate,
      systolicBloodPressure: mockRequest.systolicBloodPressure,
      diastolicBloodPressure: mockRequest.diastolicBloodPressure,
      heartBeat: mockRequest.heartBeat,
      bloodPressureNote: mockRequest.bloodPressureNote,
      createdAt: new Date('2023-06-21T08:39:46.703Z'),
      updatedAt: new Date('2023-06-21T08:39:46.703Z'),
      patientId: mockExistingPatient.id,
    })

    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockBloodPressureRecordRepo.findByPatientIdAndDate.mockResolvedValue(null)
    mockUuidService.generateUuid.mockReturnValue(mockGeneratedUuid)
    mockBloodPressureRecordRepo.save.mockResolvedValue()

    const expectedResponse = {
      id: mockGeneratedUuid,
      bloodPressureDate: mockRequest.bloodPressureDate,
      systolicBloodPressure: mockRequest.systolicBloodPressure,
      diastolicBloodPressure: mockRequest.diastolicBloodPressure,
      heartBeat: mockRequest.heartBeat,
      bloodPressureNote: mockRequest.bloodPressureNote,
      createdAt: mockBloodPressureRecord.createdAt,
      updatedAt: mockBloodPressureRecord.updatedAt,
    }

    const response = await createBloodPressureRecordUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith('1')
    expect(
      mockBloodPressureRecordRepo.findByPatientIdAndDate
    ).toHaveBeenCalledWith(
      mockExistingPatient.id,
      mockRequest.bloodPressureDate
    )
    expect(mockUuidService.generateUuid).toHaveBeenCalled()
    expect(mockBloodPressureRecordRepo.save).toHaveBeenCalledWith(
      mockBloodPressureRecord
    )
  })

  it('should throw an AuthorizationError when the patient does not exist', async () => {
    mockPatientRepo.findByUserId.mockResolvedValue(null)

    await expect(
      createBloodPressureRecordUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith('1')
    expect(
      mockBloodPressureRecordRepo.findByPatientIdAndDate
    ).not.toHaveBeenCalled()
    expect(mockUuidService.generateUuid).not.toHaveBeenCalled()
    expect(mockBloodPressureRecordRepo.save).not.toHaveBeenCalled()
  })

  it('should throw a ValidationError when a blood pressure record already exists for the same date', async () => {
    const mockExistingRecord = new BloodPressureRecord({
      id: 'existing-record-id',
      bloodPressureDate: mockRequest.bloodPressureDate,
      systolicBloodPressure: 130,
      diastolicBloodPressure: 85,
      heartBeat: 75,
      bloodPressureNote: null,
      createdAt: new Date('2023-06-21T08:39:46.703Z'),
      updatedAt: new Date('2023-06-21T08:39:46.703Z'),
      patientId: mockExistingPatient.id,
    })

    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockBloodPressureRecordRepo.findByPatientIdAndDate.mockResolvedValue(
      mockExistingRecord
    )

    await expect(
      createBloodPressureRecordUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith('1')
    expect(
      mockBloodPressureRecordRepo.findByPatientIdAndDate
    ).toHaveBeenCalledWith(
      mockExistingPatient.id,
      mockRequest.bloodPressureDate
    )
    expect(mockUuidService.generateUuid).not.toHaveBeenCalled()
    expect(mockBloodPressureRecordRepo.save).not.toHaveBeenCalled()
  })
})
