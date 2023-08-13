import { mock } from 'jest-mock-extended'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import MockDate from 'mockdate'
import { User, UserRoleType } from '../../domain/user/User'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { GenderType } from '../../domain/patient/Patient'
import { Doctor } from '../../domain/doctor/Doctor'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { CreateMultipleTimeSlotsUseCase } from './CreateMultipleTimeSlotsUseCase'
import { DoctorTimeSlot } from '../../domain/consultation/DoctorTimeSlot'
import { ValidationError } from '../../infrastructure/error/ValidationError'

describe('Unit test: CreateMultipleTimeSlotsUseCase', () => {
  const mockDoctorTimeSlotRepo = mock<IDoctorTimeSlotRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()
  const mockUuidService = mock<IUuidService>()

  const createMultipleTimeSlotsUseCase = new CreateMultipleTimeSlotsUseCase(
    mockDoctorTimeSlotRepo,
    mockDoctorRepo,
    mockUuidService
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
  const mockSingleTimeSlot = new DoctorTimeSlot({
    id: 'DoctorTimeSlo1',
    doctorId: 'doctor1',
    startAt: new Date('2023-07-18T13:00:00.155Z'),
    endAt: new Date('2023-07-18T13:30:00.155Z'),
    createdAt: mockedDate,
    updatedAt: mockedDate,
    deletedAt: new Date('2023-07-18T13:30:00.155Z'),
    availability: true,
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
    timeSlots: [
      {
        startAt: new Date('2023-07-18T13:00:00.155Z'),
        endAt: new Date('2023-07-18T13:30:00.155Z'),
      },
      {
        startAt: new Date('2023-07-19T13:00:00.155Z'),
        endAt: new Date('2023-07-19T13:30:00.155Z'),
      },
    ],
  }

  it('should throw AuthorizationError when the doctor does not exist', async () => {
    mockDoctorRepo.findByUserId.mockResolvedValue(null)
    await expect(
      createMultipleTimeSlotsUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })
  it('should throw ValidationError when the single time slot has already exist', async () => {
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(
      mockSingleTimeSlot
    )
    await expect(
      createMultipleTimeSlotsUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockSingleTimeSlot.startAt, mockRequest.user.id)
  })
  it('should create multiple when the valid request is provided', async () => {
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(null)
    mockDoctorTimeSlotRepo.save.mockResolvedValue()
    const expectedResponse = {
      doctorId: mockRequest.user.id,
      timeSlots: mockRequest.timeSlots,
    }

    const result = await createMultipleTimeSlotsUseCase.execute(mockRequest)

    expect(result).toEqual(expectedResponse)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockSingleTimeSlot.startAt, mockRequest.user.id)
  })
})
