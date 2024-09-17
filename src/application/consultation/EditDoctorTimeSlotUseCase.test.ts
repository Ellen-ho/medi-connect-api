import { mock } from 'jest-mock-extended'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { EditDoctorTimeSlotUseCase } from './EditDoctorTimeSlotUseCase'
import MockDate from 'mockdate'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { User, UserRoleType } from '../../domain/user/User'
import { Doctor, GenderType } from '../../domain/doctor/Doctor'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import {
  DoctorTimeSlot,
  TimeSlotType,
} from '../../domain/consultation/DoctorTimeSlot'
import { ValidationError } from '../../infrastructure/error/ValidationError'

describe('Unit test: EditDoctorTimeSlotUseCase', () => {
  const mockDoctorTimeSlotRepo = mock<IDoctorTimeSlotRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()

  const editDoctorTimeSlotUseCase = new EditDoctorTimeSlotUseCase(
    mockDoctorTimeSlotRepo,
    mockDoctorRepo
  )

  beforeEach(() => {
    MockDate.set('2023-06-18T13:18:00.155Z')
  })

  afterEach(() => {
    MockDate.reset()
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
      createdAt: new Date('2023-06-18T13:18:00.155Z'),
      updatedAt: new Date('2023-06-18T13:18:00.155Z'),
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
    id: 'Slot1',
    startAt: new Date('2023-07-21T13:00:00.155Z'),
    endAt: new Date('2023-07-21T13:30:00.155Z'),
    type: TimeSlotType.ONLINE,
  }

  it('should throw AuthorizationError when the doctor does not exist', async () => {
    mockDoctorRepo.findByUserId.mockResolvedValue(null)

    await expect(
      editDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })
  it('should throw NotFoundError when the time slot does not exist', async () => {
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByIdAndDoctorId.mockResolvedValue(null)

    await expect(
      editDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(NotFoundError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findByIdAndDoctorId).toHaveBeenCalledWith(
      mockRequest.id,
      mockExistingDoctor.id
    )
  })
  it('should throw ValidationError when the duplicated time slot exist', async () => {
    const mockDoctorTimeSlot = new DoctorTimeSlot({
      id: 'DoctorTimeSlo1',
      doctorId: 'doctor1',
      startAt: new Date('2023-07-18T13:00:00.155Z'),
      endAt: new Date('2023-07-18T13:30:00.155Z'),
      createdAt: mockedDate,
      updatedAt: mockedDate,
      deletedAt: new Date('2023-07-18T13:30:00.155Z'),
      availability: true,
      type: TimeSlotType.ONLINE,
    })

    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByIdAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot
    )
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot
    )

    await expect(
      editDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findByIdAndDoctorId).toHaveBeenCalledWith(
      mockRequest.id,
      mockExistingDoctor.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
  })
  it('should throw ValidationError when the time slot is before the current time', async () => {
    const mockDoctorTimeSlot2 = new DoctorTimeSlot({
      id: 'DoctorTimeSlo2',
      doctorId: 'doctor1',
      startAt: new Date('2023-05-18T13:00:00.155Z'),
      endAt: new Date('2023-05-18T13:30:00.155Z'),
      createdAt: mockedDate,
      updatedAt: mockedDate,
      deletedAt: new Date('2023-07-18T13:30:00.155Z'),
      availability: true,
      type: TimeSlotType.ONLINE,
    })
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByIdAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot2
    )
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot2
    )
    await expect(
      editDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findByIdAndDoctorId).toHaveBeenCalledWith(
      mockRequest.id,
      mockExistingDoctor.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
  })
  it('should throw ValidationError when the start time is after the end time', async () => {
    const mockDoctorTimeSlot2 = new DoctorTimeSlot({
      id: 'DoctorTimeSlo2',
      doctorId: 'doctor1',
      startAt: new Date('2023-06-21T13:30:00.155Z'),
      endAt: new Date('2023-05-21T13:00:00.155Z'),
      createdAt: mockedDate,
      updatedAt: mockedDate,
      deletedAt: new Date('2023-07-18T13:30:00.155Z'),
      availability: true,
      type: TimeSlotType.ONLINE,
    })
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByIdAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot2
    )
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot2
    )
    await expect(
      editDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findByIdAndDoctorId).toHaveBeenCalledWith(
      mockRequest.id,
      mockExistingDoctor.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
  })
  it('should throw ValidationError when the end time is not 30 mins after the start time', async () => {
    const mockDoctorTimeSlot2 = new DoctorTimeSlot({
      id: 'DoctorTimeSlo2',
      doctorId: 'doctor1',
      startAt: new Date('2023-06-21T13:00:00.155Z'),
      endAt: new Date('2023-05-21T13:20:00.155Z'),
      createdAt: mockedDate,
      updatedAt: mockedDate,
      deletedAt: new Date('2023-07-18T13:30:00.155Z'),
      availability: true,
      type: TimeSlotType.ONLINE,
    })
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByIdAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot2
    )
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot2
    )
    await expect(
      editDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findByIdAndDoctorId).toHaveBeenCalledWith(
      mockRequest.id,
      mockExistingDoctor.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
  })
  it('should throw ValidationError when doctor create time slots of next month out of the range time', async () => {
    const mockDoctorTimeSlot2 = new DoctorTimeSlot({
      id: 'DoctorTimeSlo2',
      doctorId: 'doctor1',
      startAt: new Date('2023-08-21T13:00:00.155Z'),
      endAt: new Date('2023-08-21T13:30:00.155Z'),
      createdAt: mockedDate,
      updatedAt: mockedDate,
      deletedAt: new Date('2023-07-18T13:30:00.155Z'),
      availability: true,
      type: TimeSlotType.ONLINE,
    })
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByIdAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot2
    )
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot2
    )
    await expect(
      editDoctorTimeSlotUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findByIdAndDoctorId).toHaveBeenCalledWith(
      mockRequest.id,
      mockExistingDoctor.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
  })
  it('should throw the edit doctor time slot when the valid request is provided', async () => {
    const mockDoctorTimeSlot2 = new DoctorTimeSlot({
      id: 'DoctorTimeSlot2',
      doctorId: 'doctor1',
      startAt: new Date('2023-07-21T13:00:00.155Z'),
      endAt: new Date('2023-07-21T13:30:00.155Z'),
      createdAt: mockedDate,
      updatedAt: new Date('2023-06-19T13:30:00.155Z'),
      deletedAt: new Date('2023-07-18T13:30:00.155Z'),
      availability: true,
      type: TimeSlotType.ONLINE,
    })
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockDoctorTimeSlotRepo.findByIdAndDoctorId.mockResolvedValue(
      mockDoctorTimeSlot2
    )
    mockDoctorTimeSlotRepo.findByStartAtAndDoctorId.mockResolvedValue(null)
    mockDoctorTimeSlotRepo.save.mockResolvedValue()

    const expectedResponse = {
      id: mockDoctorTimeSlot2.id,
      startAt: mockDoctorTimeSlot2.startAt,
      endAt: mockDoctorTimeSlot2.endAt,
      updatedAt: mockDoctorTimeSlot2.updatedAt,
    }

    const response = await editDoctorTimeSlotUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findByIdAndDoctorId).toHaveBeenCalledWith(
      mockRequest.id,
      mockExistingDoctor.id
    )
    expect(
      mockDoctorTimeSlotRepo.findByStartAtAndDoctorId
    ).toHaveBeenCalledWith(mockRequest.startAt, mockExistingDoctor.id)
    expect(mockDoctorTimeSlotRepo.save).toHaveBeenCalled()
  })
})
