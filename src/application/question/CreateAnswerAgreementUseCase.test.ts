import { mock } from 'jest-mock-extended'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { INotificationHelper } from '../notification/NotificationHelper'
import { CreateAnswerAgreementUseCase } from './CreateAnswerAgreementUseCase'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import MockDate from 'mockdate'
import { User, UserRoleType } from '../../domain/user/User'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { PatientQuestionAnswer } from '../../domain/question/PatientQuestionAnswer'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { Doctor, GenderType } from '../../domain/doctor/Doctor'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { AnswerAgreement } from '../../domain/question/AnswerAgreement'
import { ValidationError } from '../../infrastructure/error/ValidationError'

describe('Unit test: CreateAnswerAgreementUseCase', () => {
  const mockPatientQuestionAnswerRepo = mock<IPatientQuestionAnswerRepository>()
  const mockAnswerAgreementRepo = mock<IAnswerAgreementRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()
  const mockUuidService = mock<IUuidService>()
  const mockNotificationHelper = mock<INotificationHelper>()

  const createAnswerAgreementUseCase = new CreateAnswerAgreementUseCase(
    mockPatientQuestionAnswerRepo,
    mockAnswerAgreementRepo,
    mockDoctorRepo,
    mockUuidService,
    mockNotificationHelper
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
    doctorId: 'doctor2',
    createdAt: mockedDate,
    updatedAt: mockedDate,
  })

  const mockMakeAgreementDoctor = new Doctor({
    id: 'doctor1',
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
      id: 'doctor1',
      email: 'testD@test.com',
      displayName: 'Test User1',
      role: UserRoleType.DOCTOR,
      hashedPassword: 'hashedPassword',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  })

  const mockDoctorBeAgreed = new Doctor({
    id: 'doctor2',
    avatar: null,
    firstName: 'Nina',
    lastName: 'Lin',
    gender: GenderType.FEMALE,
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
      id: 'doctor2',
      email: 'testD2@test.com',
      displayName: 'Test User2',
      role: UserRoleType.DOCTOR,
      hashedPassword: 'hashedPassword',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  })

  it('should throw NotFoundError when the answer does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: 'doctor1',
        email: 'doctor1@test.com',
        displayName: 'Test doctor1',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      answerId: 'A2',
      comment: 'A nice answer',
    }

    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(null)

    await expect(
      createAnswerAgreementUseCase.execute(mockRequest)
    ).rejects.toThrow(NotFoundError)
    expect(mockPatientQuestionAnswerRepo.findById).toHaveBeenCalledWith(
      mockRequest.answerId
    )
  })

  it('should throw AuthorizationError when the doctor who is agreed does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: 'doctor1',
        email: 'doctor1@test.com',
        displayName: 'Test doctor1',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      answerId: 'A1',
      comment: 'A nice answer',
    }

    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(
      mockPatientQuestionAnswer
    )
    mockDoctorRepo.findById.mockResolvedValue(null)
    await expect(
      createAnswerAgreementUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientQuestionAnswerRepo.findById).toHaveBeenCalledWith(
      mockRequest.answerId
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(
      mockPatientQuestionAnswer.doctorId
    )
  })

  it('should throw AuthorizationError when the doctor who make agreement does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: 'doctor3',
        email: 'doctor3@test.com',
        displayName: 'Test doctor3',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      answerId: 'A1',
      comment: 'A nice answer',
    }
    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(
      mockPatientQuestionAnswer
    )
    mockDoctorRepo.findById.mockResolvedValue(mockDoctorBeAgreed)
    mockDoctorRepo.findByUserId.mockResolvedValue(null)
    await expect(
      createAnswerAgreementUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientQuestionAnswerRepo.findById).toHaveBeenCalledWith(
      mockRequest.answerId
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(mockDoctorBeAgreed.id)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })
  it('should throw ValidationError when the doctor has already make agreement', async () => {
    const mockRequest = {
      user: new User({
        id: 'doctor1',
        email: 'doctor1@test.com',
        displayName: 'Test doctor1',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      answerId: 'A1',
      comment: 'A nice answer',
    }

    const mockAnswerAgreement = new AnswerAgreement({
      id: 'Agreement1',
      answerId: 'A1',
      agreedDoctorId: 'doctor1',
      comment: 'Mock comment',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    })
    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(
      mockPatientQuestionAnswer
    )
    mockDoctorRepo.findById.mockResolvedValue(mockDoctorBeAgreed)
    mockDoctorRepo.findByUserId.mockResolvedValue(mockMakeAgreementDoctor)
    mockAnswerAgreementRepo.findByAnswerIdAndAgreedDoctorId.mockResolvedValue(
      mockAnswerAgreement
    )

    await expect(
      createAnswerAgreementUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockPatientQuestionAnswerRepo.findById).toHaveBeenCalledWith(
      mockRequest.answerId
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(mockDoctorBeAgreed.id)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockAnswerAgreementRepo.findByAnswerIdAndAgreedDoctorId(
        mockAnswerAgreement.answerId,
        mockAnswerAgreement.agreedDoctorId
      )
    )
  })
  it('should create a new answer agreement when valid request is provided', async () => {
    const mockGeneratedUuid = 'generated-uuid'
    const mockRequest = {
      user: new User({
        id: 'doctor1',
        email: 'doctor1@test.com',
        displayName: 'Test doctor1',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      answerId: 'A1',
      comment: 'A nice answer',
    }

    const mockTotalAgreedDoctorCounts = 1

    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(
      mockPatientQuestionAnswer
    )
    mockDoctorRepo.findById.mockResolvedValue(mockDoctorBeAgreed)
    mockDoctorRepo.findByUserId.mockResolvedValue(mockMakeAgreementDoctor)
    mockAnswerAgreementRepo.findByAnswerIdAndAgreedDoctorId.mockResolvedValue(
      null
    )
    mockUuidService.generateUuid.mockReturnValue(mockGeneratedUuid)
    mockPatientQuestionAnswerRepo.save.mockResolvedValue()
    mockAnswerAgreementRepo.countsByAnswerId.mockResolvedValue(
      mockTotalAgreedDoctorCounts
    )
    mockNotificationHelper.createNotification.mockResolvedValue()

    const expectedResponse = {
      id: mockGeneratedUuid,
      answerId: mockRequest.answerId,
      totalAgreedDoctorCounts: mockTotalAgreedDoctorCounts,
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }

    const response = await createAnswerAgreementUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockPatientQuestionAnswerRepo.findById).toHaveBeenCalledWith(
      mockRequest.answerId
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(
      mockPatientQuestionAnswer.doctorId
    )
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockUuidService.generateUuid).toHaveBeenCalled()
    expect(mockAnswerAgreementRepo.save).toHaveBeenCalled()
    expect(mockAnswerAgreementRepo.countsByAnswerId).toHaveBeenCalled()
    expect(mockNotificationHelper.createNotification).toHaveBeenCalled()
  })
})
