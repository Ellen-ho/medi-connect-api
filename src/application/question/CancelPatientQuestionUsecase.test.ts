import { mock } from 'jest-mock-extended'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { IExecutor, IRepositoryTx } from '../../domain/shared/IRepositoryTx'
import { CancelPatientQuestionUseCase } from './CancelPatientQuestionUsecase'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import MockDate from 'mockdate'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { GenderType, Patient } from '../../domain/patient/Patient'
import {
  MedicalSpecialtyType,
  PatientQuestion,
} from '../../domain/question/PatientQuestion'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { PatientQuestionAnswer } from '../../domain/question/PatientQuestionAnswer'

describe('Unit test: CancelPatientQuestionUseCase', () => {
  const mockPatientQuestionRepo = mock<IPatientQuestionRepository>()
  const mockPatientRepo = mock<IPatientRepository>()
  const mockAnswerAppreciationRepo = mock<IAnswerAppreciationRepository>()
  const mockAnswerAgreementRepo = mock<IAnswerAgreementRepository>()
  const mockPatientQuestionAnswerRepo = mock<IPatientQuestionAnswerRepository>()
  const mockTx = mock<IRepositoryTx>()
  const mockTxExecutor = mock<IExecutor>()

  const cancelPatientQuestionUseCase = new CancelPatientQuestionUseCase(
    mockPatientQuestionRepo,
    mockPatientRepo,
    mockAnswerAppreciationRepo,
    mockAnswerAgreementRepo,
    mockPatientQuestionAnswerRepo,
    mockTx
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
    medicinceUsage: null,
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

  const mockExistingQuestion = new PatientQuestion({
    id: 'Q1',
    content: 'test content',
    medicalSpecialty: MedicalSpecialtyType.INTERNAL_MEDICINE,
    createdAt: mockedDate,
    updatedAt: mockedDate,
    askerId: '2',
  })
  const mockAnswers = [
    new PatientQuestionAnswer({
      id: 'A1',
      content: 'Example answer',
      patientQuestionId: 'Q1',
      doctorId: 'doctor2',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  ]

  it('should throw AuthorizationError when the asker does not exist', async () => {
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
      patientQuestionId: 'Q1',
    }
    mockPatientRepo.findByUserId.mockResolvedValue(null)

    await expect(
      cancelPatientQuestionUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })

  it('should throw NotFoundError when the question does not exist', async () => {
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
      patientQuestionId: 'Q2',
    }
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockPatientQuestionRepo.findByIdAndAskerId.mockResolvedValue(null)

    await expect(
      cancelPatientQuestionUseCase.execute(mockRequest)
    ).rejects.toThrow(NotFoundError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockPatientQuestionRepo.findByIdAndAskerId).toHaveBeenCalledWith(
      mockRequest.patientQuestionId,
      mockRequest.user.id
    )
  })

  it('should delete the question when valid request is provided', async () => {
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
      patientQuestionId: 'Q1',
    }

    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockPatientQuestionRepo.findByIdAndAskerId.mockResolvedValue(
      mockExistingQuestion
    )
    mockTx.start.mockResolvedValue()
    mockTx.getExecutor.mockImplementation(() => mockTxExecutor)
    mockPatientQuestionAnswerRepo.findAllByQuestionId.mockResolvedValue(
      mockAnswers
    )
    mockAnswerAppreciationRepo.deleteAllByAnswerId.mockResolvedValue()
    mockAnswerAgreementRepo.deleteAllByAnswerId.mockResolvedValue()
    mockPatientQuestionAnswerRepo.deleteAllByQuestionId.mockResolvedValue()
    mockPatientQuestionRepo.deleteById.mockResolvedValue()
    mockTx.end.mockResolvedValue()

    const expectedResponse = {
      patientQuestionId: mockRequest.patientQuestionId,
    }

    const response = await cancelPatientQuestionUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockPatientQuestionRepo.findByIdAndAskerId).toHaveBeenCalledWith(
      mockRequest.patientQuestionId,
      mockRequest.user.id
    )
    expect(mockTx.start).toHaveBeenCalled()
    expect(mockTx.getExecutor).toHaveBeenCalled()
    expect(mockTx.end).toHaveBeenCalled()
  })
})
