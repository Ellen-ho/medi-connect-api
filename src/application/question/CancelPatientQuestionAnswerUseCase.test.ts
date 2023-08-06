import { mock } from 'jest-mock-extended'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IAnswerAppreciationRepository } from '../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IExecutor, IRepositoryTx } from '../../domain/shared/IRepositoryTx'
import { CancelPatientQuestionAnswerUseCase } from './CancelPatientQuestionAnswerUseCase'
import MockDate from 'mockdate'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { Doctor, GenderType } from '../../domain/doctor/Doctor'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { PatientQuestionAnswer } from '../../domain/question/PatientQuestionAnswer'

describe('Unit test: CancelPatientQuestionAnswerUseCase', () => {
  const mockPatientQuestionAnswerRepo = mock<IPatientQuestionAnswerRepository>()
  const mockAnswerAppreciationRepo = mock<IAnswerAppreciationRepository>()
  const mockAnswerAgreementRepo = mock<IAnswerAgreementRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()
  const mockTx = mock<IRepositoryTx>()
  const mockTxExecutor = mock<IExecutor>()

  const cancelPatientQuestionAnswerUseCase =
    new CancelPatientQuestionAnswerUseCase(
      mockPatientQuestionAnswerRepo,
      mockAnswerAppreciationRepo,
      mockAnswerAgreementRepo,
      mockDoctorRepo
    )

  MockDate.set('2023-06-18T13:18:00.155Z')

  afterEach(() => {
    jest.resetAllMocks()
  })

  const mockedDate = new Date('2023-06-18T13:18:00.155Z')

  const mockExistingDoctor = new Doctor({
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
  }

  const mockPatientQuestionAnswer = new PatientQuestionAnswer({
    id: 'A1',
    content: 'Example answer',
    patientQuestionId: 'Q1',
    doctorId: 'doctor1',
    createdAt: mockedDate,
    updatedAt: mockedDate,
  })

  it('should throw AuthorizationError when the doctor does not exist', async () => {
    mockDoctorRepo.findByUserId.mockResolvedValue(null)

    await expect(
      cancelPatientQuestionAnswerUseCase.execute(mockRequest, mockTx)
    ).rejects.toThrow(AuthorizationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })

  it('should throw NotFoundError when the answer does not exist', async () => {
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockPatientQuestionAnswerRepo.findByIdAndDoctorId.mockResolvedValue(null)
    await expect(
      cancelPatientQuestionAnswerUseCase.execute(mockRequest, mockTx)
    ).rejects.toThrow(NotFoundError)
    expect(
      mockPatientQuestionAnswerRepo.findByIdAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.answerId, mockRequest.user.id)
  })
  it('should delete the answer when valid request is provided', async () => {
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockPatientQuestionAnswerRepo.findByIdAndDoctorId.mockResolvedValue(
      mockPatientQuestionAnswer
    )
    mockTx.start.mockResolvedValue()
    mockTx.getExecutor.mockImplementation(() => mockTxExecutor)
    mockPatientQuestionAnswerRepo.delete.mockResolvedValue()
    mockAnswerAgreementRepo.deleteAllByAnswerId.mockResolvedValue()
    mockAnswerAppreciationRepo.deleteAllByAnswerId.mockResolvedValue()
    mockTx.end.mockResolvedValue()

    const expectedResponse = {
      answerId: mockRequest.answerId,
    }

    const response = await cancelPatientQuestionAnswerUseCase.execute(
      mockRequest,
      mockTx
    )

    expect(response).toEqual(expectedResponse)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockPatientQuestionAnswerRepo.findByIdAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.answerId, mockRequest.user.id)
    expect(mockTx.start).toHaveBeenCalled()
    expect(mockTx.getExecutor).toHaveBeenCalled()
    expect(mockPatientQuestionAnswerRepo.delete).toHaveBeenCalledWith(
      mockPatientQuestionAnswer.id,
      mockTxExecutor
    )
    expect(mockAnswerAgreementRepo.deleteAllByAnswerId).toHaveBeenCalledWith(
      mockRequest.answerId,
      mockTxExecutor
    )
    expect(mockAnswerAppreciationRepo.deleteAllByAnswerId).toHaveBeenCalledWith(
      mockRequest.answerId,
      mockTxExecutor
    )
    expect(mockTx.end).toHaveBeenCalled()
  })
})
