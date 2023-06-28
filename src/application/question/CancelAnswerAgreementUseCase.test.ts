import { mock } from 'jest-mock-extended'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IAnswerAgreementRepository } from '../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { CancelAnswerAgreementUseCase } from './CancelAnswerAgreementUseCase'
import MockDate from 'mockdate'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { User, UserRoleType } from '../../domain/user/User'
import { GenderType } from '../../domain/patient/Patient'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { Doctor } from '../../domain/doctor/Doctor'
import { AnswerAgreement } from '../../domain/question/AnswerAgreement'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

describe('Unit test: CancelAnswerAppreciationUseCase', () => {
  const mockAnswerAgreementRepo = mock<IAnswerAgreementRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()

  const cancelAnswerAppreciationUseCase = new CancelAnswerAgreementUseCase(
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

  const mockAgreement = new AnswerAgreement({
    id: 'Agreement1',
    answerId: 'A1',
    agreedDoctorId: 'doctor1',
    comment: 'Mock comment',
    createdAt: mockedDate,
    updatedAt: mockedDate,
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
    answerAgreementId: 'Agreement1',
  }

  it('should throw AuthorizationError when the doctor does not exist', async () => {
    mockDoctorRepo.findByUserId.mockResolvedValue(null)

    await expect(
      cancelAnswerAppreciationUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })

  it('should throw NotFoundError when the agreement does not exist', async () => {
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockAnswerAgreementRepo.findByIdAndAgreedDoctorId.mockResolvedValue(null)

    await expect(
      cancelAnswerAppreciationUseCase.execute(mockRequest)
    ).rejects.toThrow(NotFoundError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockAnswerAgreementRepo.findByIdAndAgreedDoctorId
    ).toHaveBeenCalledWith(mockRequest.answerAgreementId, mockRequest.user.id)
  })

  it('should delete the agreement when valid request is provided', async () => {
    const totalAgreedDoctorCounts = 1
    const agreedDoctorAvatars = ['Avatar1']
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockAnswerAgreementRepo.findByIdAndAgreedDoctorId.mockResolvedValue(
      mockAgreement
    )
    mockAnswerAgreementRepo.deleteById.mockResolvedValue()
    mockAnswerAgreementRepo.countsByAnswerId.mockResolvedValue(
      totalAgreedDoctorCounts
    )
    mockAnswerAgreementRepo.findAgreedDoctorAvatarsByAnswerId.mockResolvedValue(
      agreedDoctorAvatars
    )

    const expectedResponse = {
      totalAgreedDoctorCounts,
      agreedDoctorAvatars,
    }

    const response = await cancelAnswerAppreciationUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockAnswerAgreementRepo.findByIdAndAgreedDoctorId
    ).toHaveBeenCalledWith(mockRequest.answerAgreementId, mockRequest.user.id)
    expect(mockAnswerAgreementRepo.deleteById).toHaveBeenCalled()
    expect(mockAnswerAgreementRepo.countsByAnswerId).toHaveBeenCalledWith(
      mockAgreement.answerId
    )
    expect(
      mockAnswerAgreementRepo.findAgreedDoctorAvatarsByAnswerId
    ).toHaveBeenCalledWith(mockAgreement.answerId)
  })
})