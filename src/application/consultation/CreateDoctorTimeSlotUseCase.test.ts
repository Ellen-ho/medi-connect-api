import { mock } from 'jest-mock-extended'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { CreateDoctorTimeSlotUseCase } from './CreateDoctorTimeSlotUseCase'
import MockDate from 'mockdate'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { User, UserRoleType } from '../../domain/user/User'
import { ValidationError } from '../../infrastructure/error/ValidationError'
import { Doctor, GenderType } from '../../domain/doctor/Doctor'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { DoctorTimeSlot } from '../../domain/consultation/DoctorTimeSlot'
import dayjs from 'dayjs'

describe('Unit test: CreateDoctorTimeSlotUseCase', () => {
  const mockDoctorTimeSlotRepo = mock<IDoctorTimeSlotRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()
  const mockUuidService = mock<IUuidService>()

  const createDoctorTimeSlotUseCase = new CreateDoctorTimeSlotUseCase(
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

  const mockDoctorTimeSlot = new DoctorTimeSlot({
    id: 'DoctorTimeSlo1',
    doctorId: 'doctor1',
    startAt: new Date('2023-07-18T13:00:00.155Z'),
    endAt: new Date('2023-07-18T13:30:00.155Z'),
    createdAt: mockedDate,
    updatedAt: mockedDate,
    deletedAt: new Date('2023-07-18T13:30:00.155Z'),
    availability: true,
  })

  const nextMonthStartDate = dayjs(mockedDate).add(1, 'month').startOf('month')
  const nextMonthEndDate = dayjs(mockedDate).add(1, 'month').endOf('month')

  const nextNextMonthStartDate = dayjs(mockedDate)
    .add(2, 'month')
    .startOf('month')
  const nextNextMonthEndDate = dayjs(mockedDate).add(2, 'month').endOf('month')

  const thisMonthStartDate = dayjs(mockedDate).startOf('month')

  const thisMonthDivisionDate = thisMonthStartDate.set('date', 28)
  const nextMonthDivisionDate = nextMonthStartDate.set('date', 28)

  it('should throw AuthorizationError when the doctor does not exist', async () => {
    MockDate.set('2023-06-18T13:18:00.155Z')
    const mockedDate = new Date('2023-06-18T13:18:00.155Z')
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
      startAt: new Date('2023-07-18T13:00:00.155Z'),
      endAt: new Date('2023-07-18T13:30:00.155Z'),
    }
    mockDoctorRepo.findByUserId.mockResolvedValue(null)
    await expect(
      createDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })

  it('should throw ValidationError when the time slot has already exists.', async () => {
    MockDate.set('2023-06-18T13:18:00.155Z')
    const mockedDate = new Date('2023-06-18T13:18:00.155Z')
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
      startAt: new Date('2023-07-18T13:00:00.155Z'),
      endAt: new Date('2023-07-18T13:30:00.155Z'),
    }
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot
    )
    await expect(
      createDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
  })
  it('should throw validationError when doctor create time slots before the current time', async () => {
    MockDate.set('2023-06-18T13:18:00.155Z')
    const mockedDate = new Date('2023-06-18T13:18:00.155Z')
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
      startAt: new Date('2023-06-16T13:00:00.155Z'),
      endAt: new Date('2023-06-16T13:30:00.155Z'),
    }
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(null)

    await expect(
      createDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
    expect(dayjs(mockRequest.startAt).isBefore(mockedDate)).toBe(true)
  })

  it('should throw validationError when the start time is after the end time', async () => {
    MockDate.set('2023-06-18T13:18:00.155Z')
    const mockedDate = new Date('2023-06-18T13:18:00.155Z')
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
      startAt: new Date('2023-07-18T13:30:00.155Z'),
      endAt: new Date('2023-07-18T13:00:00.155Z'),
    }
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(null)

    await expect(
      createDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
    expect(dayjs(mockRequest.startAt).isBefore(mockedDate)).toBe(false)
    expect(dayjs(mockRequest.startAt).isAfter(mockRequest.endAt)).toBe(true)
  })
  it('should throw validationError when the end time is not 30 minutes after the start time', async () => {
    MockDate.set('2023-06-18T13:18:00.155Z')
    const mockedDate = new Date('2023-06-18T13:18:00.155Z')
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
      startAt: new Date('2023-07-18T13:00:00.155Z'),
      endAt: new Date('2023-07-18T13:50:00.155Z'),
    }
    const mockMinimumOfEndAt = dayjs(mockRequest.startAt).add(30, 'minute')
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(null)

    await expect(
      createDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
    expect(dayjs(mockRequest.startAt).isBefore(mockedDate)).toBe(false)
    expect(dayjs(mockRequest.startAt).isAfter(mockRequest.endAt)).toBe(false)
    expect(dayjs(mockRequest.endAt).isSame(mockMinimumOfEndAt)).toBe(false)
  })

  it('should throw validationError when doctor does not create time slots of next month before 28th of this month', async () => {
    MockDate.set('2023-06-18T13:18:00.155Z')
    const mockedDate = new Date('2023-06-18T13:18:00.155Z')
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
      startAt: new Date('2023-06-28T13:00:00.155Z'),
      endAt: new Date('2023-06-28T13:30:00.155Z'),
    }
    const mockMinimumOfEndAt = dayjs(mockRequest.startAt).add(30, 'minute')
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(null)

    await expect(
      createDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
    expect(dayjs(mockRequest.startAt).isBefore(mockedDate)).toBe(false)
    expect(dayjs(mockRequest.startAt).isAfter(mockRequest.endAt)).toBe(false)
    expect(dayjs(mockRequest.endAt).isSame(mockMinimumOfEndAt)).toBe(true)
    expect(dayjs(mockedDate).isBefore(thisMonthDivisionDate, 'day')).toBe(true)
    expect(
      dayjs(mockRequest.startAt).isAfter(nextMonthStartDate, 'day') ||
        dayjs(mockRequest.startAt).isSame(nextMonthStartDate, 'day')
    ).toBe(false)
    expect(
      dayjs(mockRequest.startAt).isBefore(nextMonthEndDate, 'day') ||
        dayjs(mockRequest.startAt).isSame(nextMonthEndDate, 'day')
    ).toBe(true)
  })

  it('should throw validationError when doctor create next next month time slot out of the range time', async () => {
    MockDate.set('2023-06-30T13:18:00.155Z')
    const mockedDate = new Date('2023-06-30T13:18:00.155Z')
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
      startAt: new Date('2023-09-18T13:00:00.155Z'),
      endAt: new Date('2023-09-18T13:30:00.155Z'),
    }
    const mockMinimumOfEndAt = dayjs(mockRequest.startAt).add(30, 'minute')
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(null)

    await expect(
      createDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
    expect(dayjs(mockRequest.startAt).isBefore(mockedDate)).toBe(false)
    expect(dayjs(mockRequest.startAt).isAfter(mockRequest.endAt)).toBe(false)
    expect(dayjs(mockRequest.endAt).isSame(mockMinimumOfEndAt)).toBe(true)
    expect(
      dayjs(mockedDate).isAfter(thisMonthDivisionDate, 'day') ||
        dayjs(mockedDate).isSame(thisMonthDivisionDate, 'day')
    ).toBe(true)
    expect(dayjs(mockedDate).isBefore(nextMonthDivisionDate, 'day')).toBe(true)
    expect(
      dayjs(mockRequest.startAt).isAfter(nextNextMonthStartDate, 'day') ||
        dayjs(mockRequest.startAt).isSame(nextNextMonthStartDate, 'day')
    ).toBe(true)
    expect(
      dayjs(mockRequest.startAt).isBefore(nextNextMonthEndDate, 'day') ||
        dayjs(mockRequest.startAt).isSame(nextNextMonthEndDate, 'day')
    ).toBe(false)
  })

  it('should create a doctor time slot when valid request is provided', async () => {
    MockDate.set('2023-06-18T13:18:00.155Z')
    const mockedDate = new Date('2023-06-18T13:18:00.155Z')
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
      startAt: new Date('2023-07-18T13:00:00.155Z'),
      endAt: new Date('2023-07-18T13:30:00.155Z'),
    }
    const mockMinimumOfEndAt = dayjs(mockRequest.startAt).add(30, 'minute')
    const mockGeneratedUuid = 'generatedUuid'

    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(null)
    mockUuidService.generateUuid.mockReturnValue(mockGeneratedUuid)
    mockDoctorTimeSlotRepo.save.mockResolvedValue()

    const expectedResponse = {
      id: mockGeneratedUuid,
      doctorId: mockExistingDoctor.id,
      startAt: mockRequest.startAt,
      endAt: mockRequest.endAt,
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }

    const result = await createDoctorTimeSlotUseCase.execute(mockRequest)

    expect(result).toEqual(expectedResponse)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
    expect(dayjs(mockRequest.startAt).isBefore(mockedDate)).toBe(false)
    expect(dayjs(mockRequest.startAt).isAfter(mockRequest.endAt)).toBe(false)
    expect(dayjs(mockRequest.endAt).isSame(mockMinimumOfEndAt)).toBe(true)
    expect(dayjs(mockedDate).isBefore(thisMonthDivisionDate, 'day')).toBe(true)
    expect(
      dayjs(mockRequest.startAt).isAfter(nextMonthStartDate, 'day') ||
        dayjs(mockRequest.startAt).isSame(nextMonthStartDate, 'day')
    ).toBe(true)
    expect(
      dayjs(mockRequest.startAt).isBefore(nextMonthEndDate, 'day') ||
        dayjs(mockRequest.startAt).isSame(nextMonthEndDate, 'day')
    ).toBe(true)
  })
})
