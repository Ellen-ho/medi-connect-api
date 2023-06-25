import { mock } from 'jest-mock-extended'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { CreatePatientQuestionUseCase } from './CreatePatientQuestionUseCase'
import { User, UserRoleType } from '../../domain/user/User'
import { GenderType, Patient } from '../../domain/patient/Patient'
import {
  MedicalSpecialtyType,
  PatientQuestion,
} from '../../domain/question/PatientQuestion'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'

describe('Unit test: CreatePatientQuestionUseCase', () => {
  const mockPatientQuestionRepo = mock<IPatientQuestionRepository>()
  const mockPatientRepo = mock<IPatientRepository>()
  const mockUuidService = mock<IUuidService>()

  const createPatientQuestionUseCase = new CreatePatientQuestionUseCase(
    mockPatientQuestionRepo,
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
    medicinceUsage: null,
    createdAt: mockedDate,
    updatedAt: mockedDate,
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
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
    content: 'test content',
    medicalSpecialty: MedicalSpecialtyType.INTERNAL_MEDICINE,
  }

  it('should create a new patient question when valid request is provided', async () => {
    const mockGeneratedUuid = 'generated-uuid'

    const mockPatientQuestion = new PatientQuestion({
      id: mockGeneratedUuid,
      content: 'test content',
      medicalSpecialty: MedicalSpecialtyType.INTERNAL_MEDICINE,
      createdAt: new Date('2023-06-20T09:00:00.000Z'),
      updatedAt: new Date('2023-06-20T10:00:00.000Z'),
      askerId: '1',
    })

    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockUuidService.generateUuid.mockReturnValue(mockGeneratedUuid)
    mockPatientQuestionRepo.save.mockResolvedValue()

    const expectedResponse = {
      id: mockGeneratedUuid,
      content: mockPatientQuestion.content,
      medicalSpecialty: mockPatientQuestion.medicalSpecialty,
      createdAt: mockPatientQuestion.createdAt,
      updatedAt: mockPatientQuestion.updatedAt,
    }

    const response = await createPatientQuestionUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockExistingPatient.id
    )
    expect(mockUuidService.generateUuid).toHaveBeenCalled()
    expect(mockPatientQuestionRepo.save).toHaveBeenCalledWith(
      mockPatientQuestion
    )
  })
  it('should throw AuthorizationError when the patient does not exist', async () => {
    mockPatientRepo.findByUserId.mockResolvedValue(null)

    await expect(
      createPatientQuestionUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith('1')
    expect(mockUuidService.generateUuid).not.toHaveBeenCalled()
    expect(mockPatientQuestionRepo.save).not.toHaveBeenCalled()
  })
})
