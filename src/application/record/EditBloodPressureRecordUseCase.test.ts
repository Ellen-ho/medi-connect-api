import { mock } from 'jest-mock-extended'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { EditBloodPressureRecordUseCase } from './EditBloodPressureRecordUseCase'
import { GenderType, Patient } from '../../domain/patient/Patient'
import { User, UserRoleType } from '../../domain/user/User'
import { BloodPressureRecord } from '../../domain/record/BloodPressureRecord'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { ValidationError } from '../../infrastructure/error/ValidationError'
import MockDate from 'mockdate'

describe('Unit test: EditBloodPressureRecordUseCase', () => {
  const mockBloodPressureRecordRepo = mock<IBloodPressureRecordRepository>()
  const mockPatientRepo = mock<IPatientRepository>()

  const editBloodPressureRecordUseCase = new EditBloodPressureRecordUseCase(
    mockBloodPressureRecordRepo,
    mockPatientRepo
  )

  MockDate.set('2023-06-18T13:18:00.155Z')

  afterEach(() => {
    jest.resetAllMocks()
  })

  const mockedDate = new Date('2023-06-18T13:18:00.155Z')

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
    bloodPressureRecordId: '1',
    bloodPressureDate: new Date('2023-06-18T13:18:00.155Z'),
    systolicBloodPressure: 130,
    diastolicBloodPressure: 80,
    heartBeat: 70,
    bloodPressureNote: null,
  }

  const mockExistingRecord = new BloodPressureRecord({
    id: '1',
    bloodPressureDate: new Date('2023-06-18T13:18:00.155Z'),
    systolicBloodPressure: 130,
    diastolicBloodPressure: 85,
    heartBeat: 75,
    bloodPressureNote: null,
    createdAt: new Date('2023-06-18T13:18:00.155Z'),
    updatedAt: new Date('2023-06-18T13:18:00.155Z'),
    patientId: mockExistingPatient.id,
  })

  it('should update a new blood pressure record when valid request is provided', async () => {
    const mockUpdateBloodPressureRecord = new BloodPressureRecord({
      id: '1',
      bloodPressureDate: mockRequest.bloodPressureDate,
      systolicBloodPressure: mockRequest.systolicBloodPressure,
      diastolicBloodPressure: mockRequest.diastolicBloodPressure,
      heartBeat: mockRequest.heartBeat,
      bloodPressureNote: mockRequest.bloodPressureNote,
      createdAt: new Date('2023-06-18T13:18:00.155Z'),
      updatedAt: new Date('2023-06-18T13:18:00.155Z'),
      patientId: mockExistingPatient.id,
    })

    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockBloodPressureRecordRepo.findByIdAndPatientId.mockResolvedValue(
      mockExistingRecord
    )
    mockBloodPressureRecordRepo.save.mockResolvedValue(Promise.resolve())

    const expectedResponse = {
      id: '1',
      bloodPressureDate: mockRequest.bloodPressureDate,
      systolicBloodPressure: mockRequest.systolicBloodPressure,
      diastolicBloodPressure: mockRequest.diastolicBloodPressure,
      heartBeat: mockRequest.heartBeat,
      bloodPressureNote: mockRequest.bloodPressureNote,
      createdAt: mockUpdateBloodPressureRecord.createdAt,
      updatedAt: mockUpdateBloodPressureRecord.updatedAt,
    }

    const response = await editBloodPressureRecordUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith('1')
    expect(
      mockBloodPressureRecordRepo.findByIdAndPatientId
    ).toHaveBeenCalledWith(
      mockExistingPatient.id,
      mockRequest.bloodPressureRecordId
    )
    expect(mockBloodPressureRecordRepo.save).toHaveBeenCalledWith(
      mockUpdateBloodPressureRecord
    )
  })

  it('should throw an AuthorizationError when the patient does not exist', async () => {
    mockPatientRepo.findByUserId.mockResolvedValue(null)

    await expect(
      editBloodPressureRecordUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)

    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith('1')
    expect(
      mockBloodPressureRecordRepo.findByIdAndPatientId
    ).not.toHaveBeenCalled()
    expect(
      mockBloodPressureRecordRepo.findByPatientIdAndDate
    ).not.toHaveBeenCalled()
    expect(mockBloodPressureRecordRepo.save).not.toHaveBeenCalled()
  })

  it('should throw a NotFoundError when the blood pressure record does not exist', async () => {
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)

    mockBloodPressureRecordRepo.findByIdAndPatientId.mockResolvedValue(null)
    mockBloodPressureRecordRepo.findByPatientIdAndDate.mockResolvedValue(null)

    await expect(
      editBloodPressureRecordUseCase.execute(mockRequest)
    ).rejects.toThrow(NotFoundError)

    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith('1')
    expect(
      mockBloodPressureRecordRepo.findByIdAndPatientId
    ).toHaveBeenCalledWith(
      mockRequest.bloodPressureRecordId,
      mockExistingPatient.id
    )
    expect(
      mockBloodPressureRecordRepo.findByPatientIdAndDate
    ).not.toHaveBeenCalled()
    expect(mockBloodPressureRecordRepo.save).not.toHaveBeenCalled()
  })
  it('should throw a ValidationError when the blood pressure record date is duplicated.', async () => {
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)

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
      bloodPressureRecordId: '1',
      bloodPressureDate: new Date('2023-06-20T13:18:00.155Z'),
      systolicBloodPressure: 130,
      diastolicBloodPressure: 80,
      heartBeat: 70,
      bloodPressureNote: null,
    }

    const mockDuplicateRecord = new BloodPressureRecord({
      id: 'duplicate-record-id',
      bloodPressureDate: new Date('2023-06-20T13:18:00.155Z'),
      systolicBloodPressure: 120,
      diastolicBloodPressure: 70,
      heartBeat: 65,
      bloodPressureNote: null,
      createdAt: new Date('2023-06-18T13:18:00.155Z'),
      updatedAt: new Date('2023-06-18T13:18:00.155Z'),
      patientId: mockExistingPatient.id,
    })

    mockBloodPressureRecordRepo.findByIdAndPatientId.mockResolvedValue(
      mockExistingRecord
    )
    mockBloodPressureRecordRepo.findByPatientIdAndDate.mockResolvedValue(
      mockDuplicateRecord
    )
    mockBloodPressureRecordRepo.save.mockResolvedValue()

    await expect(
      editBloodPressureRecordUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)

    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith('1')
    expect(
      mockBloodPressureRecordRepo.findByPatientIdAndDate
    ).toHaveBeenCalledWith(
      mockExistingPatient.id,
      mockRequest.bloodPressureDate
    )
    expect(mockBloodPressureRecordRepo.save).not.toHaveBeenCalled()
  })
})
