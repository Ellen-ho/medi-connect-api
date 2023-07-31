import { mock } from 'jest-mock-extended'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { INotificationHelper } from '../notification/NotificationHelper'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { CreateAnswerAppreciationUseCase } from './CreateAnswerAppreciationUseCase'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import MockDate from 'mockdate'
import { User, UserRoleType } from '../../domain/user/User'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { PatientQuestionAnswer } from '../../domain/question/PatientQuestionAnswer'
import { GenderType, Patient } from '../../domain/patient/Patient'
import { Doctor } from '../../domain/doctor/Doctor'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { AnswerAppreciation } from '../../domain/question/AnswerAppreciation'

describe('Unit test: CreateAnswerAppreciationUseCase', () => {
  const mockPatientQuestionAnswerRepo = mock<IPatientQuestionAnswerRepository>()
  const mockPatientRepo = mock<IPatientRepository>()
  const mockAnswerAppreciationRepo = mock<IAnswerAppreciationRepository>()
  const mockUuidService = mock<IUuidService>()
  const mockNotificationHelper = mock<INotificationHelper>()
  const mockDoctorRepo = mock<IDoctorRepository>()

  const createAnswerAppreciationUseCase = new CreateAnswerAppreciationUseCase(
    mockPatientQuestionAnswerRepo,
    mockPatientRepo,
    mockAnswerAppreciationRepo,
    mockUuidService,
    mockNotificationHelper,
    mockDoctorRepo
  )

  MockDate.set('2023-06-18T13:18:00.155Z')

  afterEach(() => {
    jest.resetAllMocks()
  })

  const mockedDate = new Date('2023-06-18T13:18:00.155Z')
  const mockPatientQuestionAnswer = new PatientQuestionAnswer({
    id: 'A1',
    content: 'Example answer',
    patientQuestionId: 'Q1',
    doctorId: '1',
    createdAt: mockedDate,
    updatedAt: mockedDate,
  })

  const mockExistingPatient = new Patient({
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
      displayName: 'Test User1',
      role: UserRoleType.DOCTOR,
      hashedPassword: 'hashedPassword',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  })

  it('should throw NotFoundError when the answer does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: 'patient1',
        email: 'patient1@test.com',
        displayName: 'Test patient1',
        role: UserRoleType.PATIENT,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      content: 'Thank you',
      answerId: 'A2',
    }

    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(null)

    await expect(
      createAnswerAppreciationUseCase.execute(mockRequest)
    ).rejects.toThrow(NotFoundError)
    expect(mockPatientQuestionAnswerRepo.findById).toHaveBeenCalledWith(
      mockRequest.answerId
    )
  })

  it('should throw AuthorizationError when the patient does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: 'patient2',
        email: 'patient2@test.com',
        displayName: 'Test patient2',
        role: UserRoleType.PATIENT,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      content: 'Thank you',
      answerId: 'A1',
    }

    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(
      mockPatientQuestionAnswer
    )
    mockPatientRepo.findByUserId.mockResolvedValue(null)

    await expect(
      createAnswerAppreciationUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientQuestionAnswerRepo.findById).toHaveBeenCalledWith(
      mockRequest.answerId
    )
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })

  it('should throw AuthorizationError when the doctor who is appreciated does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: 'patient1',
        email: 'patient1@test.com',
        displayName: 'Test patient1',
        role: UserRoleType.PATIENT,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      content: 'Thank you',
      answerId: 'A1',
    }
    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(
      mockPatientQuestionAnswer
    )
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockDoctorRepo.findById.mockResolvedValue(null)
    await expect(
      createAnswerAppreciationUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientQuestionAnswerRepo.findById).toHaveBeenCalledWith(
      mockRequest.answerId
    )
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(
      mockPatientQuestionAnswer.doctorId
    )
  })

  it('should create a new answer appreciation when valid request is provided', async () => {
    const mockGeneratedUuid = 'generated-uuid'
    const mockRequest = {
      user: new User({
        id: 'patient1',
        email: 'patient1@test.com',
        displayName: 'Test patient1',
        role: UserRoleType.PATIENT,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      content: 'Thank you',
      answerId: 'A1',
    }

    const mockAnswerAppreciation = new AnswerAppreciation({
      id: 'generated-uuid',
      content: 'Thank you',
      patient: mockExistingPatient,
      answer: mockPatientQuestionAnswer,
      createdAt: mockedDate,
      updatedAt: mockedDate,
    })

    const mockTotalThankCounts = 1

    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(
      mockPatientQuestionAnswer
    )
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockDoctorRepo.findById.mockResolvedValue(mockExistingDoctor)
    mockUuidService.generateUuid.mockReturnValue(mockGeneratedUuid)
    mockPatientQuestionAnswerRepo.save.mockResolvedValue()
    mockAnswerAppreciationRepo.countByAnswerId.mockResolvedValue(
      mockTotalThankCounts
    )
    mockNotificationHelper.createNotification.mockResolvedValue()

    const expectedResponse = {
      id: mockGeneratedUuid,
      answerId: mockRequest.answerId,
      totalThankCounts: mockTotalThankCounts,
      createdAt: mockAnswerAppreciation.createdAt,
      updatedAt: mockAnswerAppreciation.updatedAt,
    }

    const response = await createAnswerAppreciationUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockPatientQuestionAnswerRepo.findById).toHaveBeenCalledWith(
      mockRequest.answerId
    )
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(
      mockPatientQuestionAnswer.doctorId
    )
    expect(mockUuidService.generateUuid).toHaveBeenCalled()
    expect(mockAnswerAppreciationRepo.save).toHaveBeenCalled()
    expect(mockAnswerAppreciationRepo.countByAnswerId).toHaveBeenCalledWith(
      mockPatientQuestionAnswer.id
    )
    expect(mockNotificationHelper.createNotification).toHaveBeenCalled()
  })
})
