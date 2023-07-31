import { mock } from 'jest-mock-extended'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { INotificationHelper } from '../notification/NotificationHelper'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { CreatePatientQuestionAnswerUseCase } from './CreatePatientQuestionAnswerUseCase'
import MockDate from 'mockdate'
import { PatientQuestionAnswer } from '../../domain/question/PatientQuestionAnswer'
import {
  MedicalSpecialtyType,
  PatientQuestion,
} from '../../domain/question/PatientQuestion'
import { GenderType, Patient } from '../../domain/patient/Patient'
import { User, UserRoleType } from '../../domain/user/User'
import { Doctor } from '../../domain/doctor/Doctor'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

describe('Unit test: CreatePatientQuestionAnswerUseCase', () => {
  const mockPatientQuestionAnswerRepo = mock<IPatientQuestionAnswerRepository>()
  const mockPatientQuestionRepo = mock<IPatientQuestionRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()
  const mockUuidService = mock<IUuidService>()
  const mockNotificationHelper = mock<INotificationHelper>()
  const mockPatientRepo = mock<IPatientRepository>()

  const createPatientQuestionAnswerUseCase =
    new CreatePatientQuestionAnswerUseCase(
      mockPatientQuestionAnswerRepo,
      mockPatientQuestionRepo,
      mockDoctorRepo,
      mockUuidService,
      mockNotificationHelper,
      mockPatientRepo
    )

  MockDate.set('2023-06-18T13:18:00.155Z')

  afterEach(() => {
    jest.resetAllMocks()
  })

  const mockedDate = new Date('2023-06-18T13:18:00.155Z')
  const mockExistingQuestion = new PatientQuestion({
    id: 'Q1',
    content: 'test content',
    medicalSpecialty: MedicalSpecialtyType.INTERNAL_MEDICINE,
    createdAt: mockedDate,
    updatedAt: mockedDate,
    askerId: '2',
  })

  const mockPatientWhoAsk = new Patient({
    id: '2',
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
    createdAt: mockedDate,
    updatedAt: mockedDate,
    user: new User({
      id: '2',
      email: 'testP@test.com',
      displayName: 'Test User2',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  })

  const mockExistingDoctor = new Doctor({
    id: '1',
    avatar: null,
    firstName: 'Tim',
    lastName: 'Lin',
    gender: GenderType.MALE,
    aboutMe: 'About me',
    languagesSpoken: ['English', 'Spanish'],
    specialties: [MedicalSpecialtyType.INTERNAL_MEDICINE],
    careerStartDate: new Date(),
    officePracticalLocation: {
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'Cityville',
      stateProvince: 'State',
      postalCode: '12345',
      country: 'United States',
      countryCode: 'US',
    },
    education: ['Medical School'],
    awards: ['Best Doctor Award'],
    affiliations: ['Medical Association'],
    createdAt: new Date(),
    updatedAt: new Date(),
    user: new User({
      id: '1',
      email: 'testD@test.com',
      displayName: 'Test User',
      role: UserRoleType.DOCTOR,
      hashedPassword: 'hashedPassword',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  })

  it('should throw AuthorizationError when the question does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: '1',
        email: 'test@test.com',
        displayName: 'Test User',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      content: 'test content',
      patientQuestionId: 'Q2',
    }

    mockPatientQuestionRepo.findById.mockResolvedValue(null)

    await expect(
      createPatientQuestionAnswerUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientQuestionRepo.findById).toHaveBeenCalledWith(
      mockRequest.patientQuestionId
    )
  })

  it('should throw AuthorizationError when patient who ask the question does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: '1',
        email: 'testD@test.com',
        displayName: 'Test User',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      content: 'test content',
      patientQuestionId: 'Q1',
    }
    const mockAnotherPatient = new Patient({
      id: '2',
      avatar: null,
      firstName: 'Tim',
      lastName: 'Wang',
      birthDate: new Date('1990-03-05'),
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
      createdAt: mockedDate,
      updatedAt: mockedDate,
      user: new User({
        id: '3',
        email: 'test3@test.com',
        displayName: 'Test User3',
        role: UserRoleType.PATIENT,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
    })

    mockPatientQuestionRepo.findById.mockResolvedValue(mockExistingQuestion)
    mockPatientRepo.findById.mockResolvedValue(null)

    await expect(
      createPatientQuestionAnswerUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientQuestionRepo.findById).toHaveBeenCalledWith(
      mockExistingQuestion.id
    )
    expect(mockPatientRepo.findById).toHaveBeenCalledWith(mockAnotherPatient.id)
  })

  it('should throw AuthorizationError when the doctor does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: '1',
        email: 'testD@test.com',
        displayName: 'Test User',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      content: 'test content',
      patientQuestionId: 'Q1',
    }

    mockPatientQuestionRepo.findById.mockResolvedValue(mockExistingQuestion)
    mockPatientRepo.findById.mockResolvedValue(mockPatientWhoAsk)
    mockDoctorRepo.findByUserId.mockResolvedValue(null)
    await expect(
      createPatientQuestionAnswerUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientQuestionRepo.findById).toHaveBeenCalledWith(
      mockExistingQuestion.id
    )
    expect(mockPatientRepo.findById).toHaveBeenCalledWith(mockPatientWhoAsk.id)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })
  it('should throw ValidationError when the answer has already exist', async () => {
    const mockRequest = {
      user: new User({
        id: '1',
        email: 'test@test.com',
        displayName: 'Test User',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      content: 'test content',
      patientQuestionId: 'Q1',
    }

    const mockPatientQuestionAnswer = new PatientQuestionAnswer({
      id: 'A1',
      content: 'Example answer',
      patientQuestionId: 'Q1',
      doctorId: '1',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    })

    mockPatientQuestionRepo.findById.mockResolvedValue(mockExistingQuestion)
    mockPatientRepo.findById.mockResolvedValue(mockPatientWhoAsk)
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockPatientQuestionAnswerRepo.findByQuestionIdAndDoctorId.mockResolvedValue(
      mockPatientQuestionAnswer
    )

    await expect(
      createPatientQuestionAnswerUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockPatientQuestionRepo.findById).toHaveBeenCalledWith(
      mockExistingQuestion.id
    )
    expect(mockPatientRepo.findById).toHaveBeenCalledWith(mockPatientWhoAsk.id)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockExistingDoctor.id
    )
    expect(
      mockPatientQuestionAnswerRepo.findByQuestionIdAndDoctorId
    ).toHaveBeenCalledWith(mockExistingQuestion.id, mockExistingDoctor.id)
  })

  it('should create a new patient question answer when valid request is provided', async () => {
    const mockGeneratedUuid = 'generated-uuid'
    const mockRequest = {
      user: new User({
        id: '1',
        email: 'test@test.com',
        displayName: 'Test User',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      content: 'test content',
      patientQuestionId: 'Q1',
    }
    const mockPatientQuestionAnswer = new PatientQuestionAnswer({
      id: 'generated-uuid',
      content: 'test content',
      patientQuestionId: 'Q1',
      doctorId: '1',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    })

    mockPatientQuestionRepo.findById.mockResolvedValue(mockExistingQuestion)
    mockPatientRepo.findById.mockResolvedValue(mockPatientWhoAsk)
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockPatientQuestionAnswerRepo.findByQuestionIdAndDoctorId.mockResolvedValue(
      null
    )
    mockUuidService.generateUuid.mockReturnValue(mockGeneratedUuid)
    mockPatientQuestionAnswerRepo.save.mockResolvedValue()
    mockNotificationHelper.createNotification.mockResolvedValue()

    const expectedResponse = {
      id: mockGeneratedUuid,
      content: mockPatientQuestionAnswer.content,
      patientQuestionId: mockPatientQuestionAnswer.patientQuestionId,
      createdAt: mockPatientQuestionAnswer.createdAt,
      updatedAt: mockPatientQuestionAnswer.updatedAt,
    }

    const response = await createPatientQuestionAnswerUseCase.execute(
      mockRequest
    )

    expect(response).toEqual(expectedResponse)
    expect(mockPatientQuestionRepo.findById).toHaveBeenCalledWith(
      mockExistingQuestion.id
    )
    expect(mockPatientRepo.findById).toHaveBeenCalledWith(mockPatientWhoAsk.id)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockExistingDoctor.id
    )
    expect(mockUuidService.generateUuid).toHaveBeenCalled()
    expect(mockPatientQuestionAnswerRepo.save).toHaveBeenCalledWith(
      mockPatientQuestionAnswer
    )
    expect(mockNotificationHelper.createNotification).toHaveBeenCalled()
  })
})
