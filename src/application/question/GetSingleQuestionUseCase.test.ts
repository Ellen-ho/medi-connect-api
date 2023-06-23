import { mock } from 'jest-mock-extended'
import { GetSingleQuestionUseCase } from './GetSingleQuestionUseCase'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { GenderType, Patient } from '../../domain/patient/Patient'
import { User, UserRoleType } from '../../domain/user/User'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import {
  MedicalSpecialtyType,
  PatientQuestion,
} from '../../domain/question/PatientQuestion'
import dayjs from 'dayjs'

describe('Unit test: GetSingleQuestionUseCase', () => {
  const mockPatientQuestionRepo = mock<IPatientQuestionRepository>()
  const mockPatientRepo = mock<IPatientRepository>()
  const mockPatientQuestionAnswerRepo = mock<IPatientQuestionAnswerRepository>()

  const getSingleQuestionUseCase = new GetSingleQuestionUseCase(
    mockPatientQuestionRepo,
    mockPatientRepo,
    mockPatientQuestionAnswerRepo
  )

  const mockedDate = new Date('2023-06-18T13:18:00.155Z')
  jest.spyOn(global, 'Date').mockImplementation(() => mockedDate)

  afterEach(() => {
    jest.resetAllMocks()
  })

  const mockPatient = new Patient({
    id: 'patient1',
    avatar: null,
    firstName: 'John',
    lastName: 'Doe',
    birthDate: new Date('1990-06-20T09:00:00.000Z'),
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

  const mockQuestion = new PatientQuestion({
    id: 'Q1',
    content: 'Example question',
    medicalSpecialty: MedicalSpecialtyType.INTERNAL_MEDICINE,
    createdAt: mockedDate,
    updatedAt: mockedDate,
    askerId: 'patient1',
  })

  const mockAnswer = [
    {
      doctorAvatars: ['avatar1', 'avatar2', null],
      content: 'Example answer',
      avatar: 'doctorAvatar',
      firstName: 'John',
      lastName: 'Doe',
      specialties: [MedicalSpecialtyType.INTERNAL_MEDICINE],
      careerStartDate: new Date('2010-01-01T09:00:00.000Z'),
      agreeCounts: 10,
      thankCounts: 5,
      isThanked: true,
    },
  ]

  it('should throw NotFoundError when the question does not exist', async () => {
    const mockRequest = { asker: mockPatient, patientQuestionId: 'Q1' }

    mockPatientQuestionRepo.findById.mockResolvedValue(null)

    await expect(getSingleQuestionUseCase.execute(mockRequest)).rejects.toThrow(
      NotFoundError
    )
    expect(mockPatientQuestionRepo.findById).toHaveBeenCalledWith(
      mockRequest.patientQuestionId
    )
  })

  it('should throw AuthorizationError when the asker does not exist', async () => {
    const mockRequest = { asker: mockPatient, patientQuestionId: 'Q1' }

    mockPatientQuestionRepo.findById.mockResolvedValue(mockQuestion)
    mockPatientRepo.findById.mockResolvedValue(null)

    await expect(getSingleQuestionUseCase.execute(mockRequest)).rejects.toThrow(
      AuthorizationError
    )
    expect(mockPatientQuestionRepo.findById).toHaveBeenCalledWith(
      mockRequest.patientQuestionId
    )
    expect(mockPatientRepo.findById).toHaveBeenCalledWith(mockRequest.asker.id)
  })

  it('should throw NotFoundError when no answer for this question', async () => {
    const mockRequest = { asker: mockPatient, patientQuestionId: 'Q1' }

    mockPatientQuestionRepo.findById.mockResolvedValue(mockQuestion)
    mockPatientRepo.findById.mockResolvedValue(mockPatient)
    mockPatientQuestionAnswerRepo.findAnswerDetailsByQuestionIdAndPatientId.mockResolvedValue(
      []
    )
    await expect(getSingleQuestionUseCase.execute(mockRequest)).rejects.toThrow(
      NotFoundError
    )
    expect(mockPatientQuestionRepo.findById).toHaveBeenCalledWith(
      mockRequest.patientQuestionId
    )
    expect(mockPatientRepo.findById).toHaveBeenCalledWith(mockRequest.asker.id)
    expect(
      mockPatientQuestionAnswerRepo.findAnswerDetailsByQuestionIdAndPatientId
    ).toHaveBeenCalledWith(mockRequest.patientQuestionId, mockRequest.asker.id)
  })
  it('should get the question when valid request is provided', async () => {
    const mockRequest = { asker: mockPatient, patientQuestionId: 'Q1' }

    mockPatientQuestionRepo.findById.mockResolvedValue(mockQuestion)
    mockPatientRepo.findById.mockResolvedValue(mockPatient)
    mockPatientQuestionAnswerRepo.findAnswerDetailsByQuestionIdAndPatientId.mockResolvedValue(
      mockAnswer
    )

    const expectedResponse = {
      question: {
        content: mockQuestion.content,
        askerAge: dayjs().diff(mockPatient.birthDate, 'year'),
      },
      answers: mockAnswer,
    }

    const response = await getSingleQuestionUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockPatientQuestionRepo.findById).toHaveBeenCalledWith(
      mockRequest.patientQuestionId
    )
    expect(mockPatientRepo.findById).toHaveBeenCalledWith(mockRequest.asker.id)
    expect(
      mockPatientQuestionAnswerRepo.findAnswerDetailsByQuestionIdAndPatientId
    ).toHaveBeenCalledWith(mockRequest.patientQuestionId, mockRequest.asker.id)
  })
})
