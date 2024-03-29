import { mock } from 'jest-mock-extended'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { CancelAnswerAppreciationUseCase } from './CancelAnswerAppreciationUseCase'
import MockDate from 'mockdate'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { User, UserRoleType } from '../../domain/user/User'
import { GenderType, Patient } from '../../domain/patient/Patient'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { PatientQuestionAnswer } from '../../domain/question/PatientQuestionAnswer'
import { AnswerAppreciation } from '../../domain/question/AnswerAppreciation'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { INotificationHelper } from '../notification/NotificationHelper'
import { Doctor } from '../../domain/doctor/Doctor'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'

describe('Unit test: CancelAnswerAppreciationUseCase', () => {
  const mockAnswerAppreciationRepo = mock<IAnswerAppreciationRepository>()
  const mockPatientRepo = mock<IPatientRepository>()
  const mockPatientQuestionAnswerRepo = mock<IPatientQuestionAnswerRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()
  const mockNotifictionHelper = mock<INotificationHelper>()

  const cancelAnswerAppreciationUseCase = new CancelAnswerAppreciationUseCase(
    mockAnswerAppreciationRepo,
    mockPatientRepo,
    mockPatientQuestionAnswerRepo,
    mockDoctorRepo,
    mockNotifictionHelper
  )

  MockDate.set('2023-06-18T13:18:00.155Z')

  afterEach(() => {
    jest.resetAllMocks()
  })

  const mockedDate = new Date('2023-06-18T13:18:00.155Z')

  const mockExistingPatient = new Patient({
    id: 'patient1',
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
      id: 'patient1',
      email: 'patient1@test.com',
      displayName: 'Test patient1',
      role: UserRoleType.PATIENT,
      hashedPassword: 'hashedPassword',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  })

  const mockExistingDoctor = new Doctor({
    id: 'doctor1',
    avatar: null,
    firstName: 'John',
    lastName: 'Doe',
    gender: GenderType.MALE,
    aboutMe:
      'I have been a physician for over 10 years, specializing in cardiology.',
    languagesSpoken: ['English', 'Spanish'],
    specialties: [MedicalSpecialtyType.CARDIOLOGY],
    careerStartDate: new Date('2010-01-01T00:00:00.000Z'),
    officePracticalLocation: {
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'Cityville',
      stateProvince: 'State',
      postalCode: '12345',
      country: 'United States',
      countryCode: 'US',
    },
    education: [],
    awards: null,
    affiliations: null,
    createdAt: mockedDate,
    updatedAt: mockedDate,
    user: new User({
      id: 'doctor1',
      email: 'doctor1@test.com',
      displayName: 'Test patient1',
      role: UserRoleType.DOCTOR,
      hashedPassword: 'hashedPassword',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  })

  const mockPatientQuestionAnswer = new PatientQuestionAnswer({
    id: 'A1',
    content: 'Example answer',
    patientQuestionId: 'Q1',
    doctorId: 'doctor1',
    createdAt: mockedDate,
    updatedAt: mockedDate,
  })

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
    answerId: 'A1',
  }

  const mockAppreciation = new AnswerAppreciation({
    id: 'Appreciation1',
    content: 'Mock appreciation content',
    patient: mockExistingPatient,
    answer: mockPatientQuestionAnswer,
    createdAt: mockedDate,
    updatedAt: mockedDate,
  })

  it('should throw AuthorizationError when the patient does not exist', async () => {
    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(
      mockPatientQuestionAnswer
    )
    mockDoctorRepo.findById.mockResolvedValue(mockExistingDoctor)
    mockPatientRepo.findByUserId.mockResolvedValue(null)

    await expect(
      cancelAnswerAppreciationUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })

  it('should throw NotFoundError when the appreciation does not exist', async () => {
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockAnswerAppreciationRepo.findByIdAndPatientId.mockResolvedValue(null)
    await expect(
      cancelAnswerAppreciationUseCase.execute(mockRequest)
    ).rejects.toThrow(NotFoundError)
  })

  it('should delete the appreciation when valid request is provided', async () => {
    const totalThankCounts = 1

    mockPatientQuestionAnswerRepo.findById.mockResolvedValue(
      mockPatientQuestionAnswer
    )
    mockDoctorRepo.findById.mockResolvedValue(mockExistingDoctor)
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockAnswerAppreciationRepo.findByAnswerIdAndPatientId.mockResolvedValue(
      mockAppreciation
    )
    mockAnswerAppreciationRepo.delete.mockResolvedValue()
    mockAnswerAppreciationRepo.countByAnswerId.mockResolvedValue(
      totalThankCounts
    )

    const expectedResponse = {
      totalThankCounts,
    }

    const response = await cancelAnswerAppreciationUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockAnswerAppreciationRepo.delete).toHaveBeenCalled()
  })
})
