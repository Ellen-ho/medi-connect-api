import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorTimeSlotRepository } from '../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IMeetingLinkRepository } from '../../domain/meeting/interface/IMeetingLinkRepository'
import { IUuidService } from '../../domain/utils/IUuidService'
import { INotificationHelper } from '../notification/NotificationHelper'
import { IScheduler } from '../../infrastructure/network/Scheduler'
import { CreateConsultAppointmentUseCase } from './CreateConsultAppointmentUseCase'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { GenderType, Patient } from '../../domain/patient/Patient'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { Doctor } from '../../domain/doctor/Doctor'
import { DoctorTimeSlot } from '../../domain/consultation/DoctorTimeSlot'
import { ValidationError } from '../../infrastructure/error/ValidationError'
import {
  MeetingLink,
  MeetingLinkStatus,
} from '../../domain/meeting/MeetingLink'
describe('Unit test: CreateConsultAppointmentUseCase', () => {
  const mockConsultAppointmentRepo = mock<IConsultAppointmentRepository>()
  const mockDoctorTimeSlotRepo = mock<IDoctorTimeSlotRepository>()
  const mockPatientRepo = mock<IPatientRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()
  const mockMeetingLinkRepo = mock<IMeetingLinkRepository>()
  const mockUuidService = mock<IUuidService>()
  const mockNotificationHelper = mock<INotificationHelper>()
  const mockScheduler = mock<IScheduler>()

  const createConsultAppointmentUseCase = new CreateConsultAppointmentUseCase(
    mockConsultAppointmentRepo,
    mockDoctorTimeSlotRepo,
    mockPatientRepo,
    mockDoctorRepo,
    mockMeetingLinkRepo,
    mockUuidService,
    mockNotificationHelper,
    mockScheduler
  )

  beforeEach(() => {
    MockDate.set('2023-06-18T13:18:00.155Z')
  })

  afterEach(() => {
    MockDate.reset()
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

  const mockExistingDoctor = new Doctor({
    id: 'doctor1',
    avatar: null,
    firstName: 'Tim',
    lastName: 'Lin',
    gender: GenderType.MALE,
    aboutMe: 'About me',
    languagesSpoken: ['English', 'Spanish'],
    specialties: [MedicalSpecialtyType.INTERNAL_MEDICINE],
    careerStartDate: new Date('1990-06-18T13:18:00.155Z'),
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
    createdAt: mockedDate,
    updatedAt: mockedDate,
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

  it('should throw AuthorizationError when the patient does not exist', async () => {
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
      doctorTimeSlotId: 'Slot1',
    }
    mockPatientRepo.findByUserId.mockResolvedValue(null)
    await expect(
      createConsultAppointmentUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })

  it('should throw AuthorizationError when the doctor time slot does not exist', async () => {
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
      doctorTimeSlotId: 'Slot2',
    }
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockDoctorTimeSlotRepo.findById.mockResolvedValue(null)
    await expect(
      createConsultAppointmentUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findById).toHaveBeenCalledWith(
      mockRequest.doctorTimeSlotId
    )
  })

  it('should throw AuthorizationError when the doctor who does not exist', async () => {
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
      doctorTimeSlotId: 'Slot2',
    }

    const mockDoctorTimeSlot = new DoctorTimeSlot({
      id: 'DoctorTimeSlo2',
      doctorId: 'doctor2',
      startAt: new Date('2023-06-30T13:00:00.155Z'),
      endAt: new Date('2023-06-30T13:30:00.155Z'),
      createdAt: mockedDate,
      updatedAt: mockedDate,
      availability: true,
    })

    const mockExistingDoctor2 = new Doctor({
      id: 'doctor2',
      avatar: null,
      firstName: 'Tim',
      lastName: 'Lin',
      gender: GenderType.MALE,
      aboutMe: 'About me',
      languagesSpoken: ['English', 'Spanish'],
      specialties: [MedicalSpecialtyType.INTERNAL_MEDICINE],
      careerStartDate: new Date('1990-06-18T13:18:00.155Z'),
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
      createdAt: mockedDate,
      updatedAt: mockedDate,
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
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockDoctorTimeSlotRepo.findById.mockResolvedValue(mockDoctorTimeSlot)
    mockDoctorRepo.findById.mockResolvedValue(null)
    await expect(
      createConsultAppointmentUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findById).toHaveBeenCalledWith(
      mockRequest.doctorTimeSlotId
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(mockExistingDoctor2.id)
  })

  it('should throw ValidationError when the appointment does not be within 24 hours', async () => {
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
      doctorTimeSlotId: 'Slot1',
    }

    const mockDoctorTimeSlot = new DoctorTimeSlot({
      id: 'Slot1',
      doctorId: 'doctor1',
      startAt: new Date('2023-06-18T19:30:00.155Z'),
      endAt: new Date('2023-06-18T19:30:00.155Z'),
      createdAt: mockedDate,
      updatedAt: mockedDate,
      availability: true,
    })

    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockDoctorTimeSlotRepo.findById.mockResolvedValue(mockDoctorTimeSlot)
    mockDoctorRepo.findById.mockResolvedValue(mockExistingDoctor)

    await expect(
      createConsultAppointmentUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findById).toHaveBeenCalledWith(
      mockRequest.doctorTimeSlotId
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(mockExistingDoctor.id)
  })

  it('should throw ValidationError when the appointment is not within the current month range', async () => {
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
      doctorTimeSlotId: 'Slot1',
    }
    const mockDoctorTimeSlot2 = new DoctorTimeSlot({
      id: 'Slot1',
      doctorId: 'doctor1',
      startAt: new Date('2023-07-18T20:00:00.155Z'),
      endAt: new Date('2023-07-18T20:30:00.155Z'),
      createdAt: mockedDate,
      updatedAt: mockedDate,
      availability: true,
    })

    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockDoctorTimeSlotRepo.findById.mockResolvedValue(mockDoctorTimeSlot2)
    mockDoctorRepo.findById.mockResolvedValue(mockExistingDoctor)

    await expect(
      createConsultAppointmentUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findById).toHaveBeenCalledWith(
      mockRequest.doctorTimeSlotId
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(mockExistingDoctor.id)
  })

  it('should throw ValidationError when the appointment is not within the current or next month range.', async () => {
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
      doctorTimeSlotId: 'Slot1',
    }
    MockDate.set('2023-06-30T13:18:00.155Z')
    const mockCurrentDate = new Date('2023-06-30T13:18:00.155Z')
    const mockDoctorTimeSlot3 = new DoctorTimeSlot({
      id: 'DoctorTimeSlot3',
      doctorId: 'doctor1',
      startAt: new Date('2023-08-18T20:00:00.155Z'),
      endAt: new Date('2023-08-18T20:30:00.155Z'),
      createdAt: mockCurrentDate,
      updatedAt: mockCurrentDate,
      availability: true,
    })

    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockDoctorTimeSlotRepo.findById.mockResolvedValue(mockDoctorTimeSlot3)
    mockDoctorRepo.findById.mockResolvedValue(mockExistingDoctor)

    await expect(
      createConsultAppointmentUseCase.execute(mockRequest)
    ).rejects.toThrow(ValidationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findById).toHaveBeenCalledWith(
      mockRequest.doctorTimeSlotId
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(mockExistingDoctor.id)
  })

  it('should create a consult appointment when valid request is provided', async () => {
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
      doctorTimeSlotId: 'Slot4',
    }
    const mockDoctorTimeSlot4 = new DoctorTimeSlot({
      id: 'Slot4',
      doctorId: 'doctor1',
      startAt: new Date('2023-06-30T13:00:00.155Z'),
      endAt: new Date('2023-06-30T13:30:00.155Z'),
      createdAt: new Date('2023-05-18T13:00:00.155Z'),
      updatedAt: new Date('2023-05-18T13:00:00.155Z'),
      availability: true,
    })
    const mockGeneratedUuid = 'generatedUuid'
    const mockMeetingLink = new MeetingLink({
      id: 'Link1',
      link: 'https://example.com/meeting',
      status: MeetingLinkStatus.AVAILABLE,
      createdAt: mockedDate,
      updatedAt: mockedDate,
    })

    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockDoctorTimeSlotRepo.findById.mockResolvedValue(mockDoctorTimeSlot4)
    mockDoctorRepo.findById.mockResolvedValue(mockExistingDoctor)
    mockMeetingLinkRepo.findRandomByStatus.mockResolvedValue(mockMeetingLink)
    mockMeetingLinkRepo.save.mockResolvedValue()
    mockUuidService.generateUuid.mockReturnValue(mockGeneratedUuid)
    mockConsultAppointmentRepo.save.mockResolvedValue()
    mockNotificationHelper.createNotification.mockResolvedValue()

    const expectedResponse = {
      id: mockGeneratedUuid,
    }

    const result = await createConsultAppointmentUseCase.execute(mockRequest)

    expect(result).toEqual(expectedResponse)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(mockDoctorTimeSlotRepo.findById).toHaveBeenCalledWith(
      mockRequest.doctorTimeSlotId
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(mockExistingDoctor.id)
    expect(mockDoctorTimeSlot4.availability).toBe(false)
    expect(mockMeetingLinkRepo.findRandomByStatus).toHaveBeenCalledWith(
      MeetingLinkStatus.AVAILABLE
    )
    expect(mockMeetingLink.status).toBe(MeetingLinkStatus.IN_USED)
    expect(mockConsultAppointmentRepo.save).toHaveBeenCalled()
    expect(mockNotificationHelper.createNotification).toHaveBeenCalled()
  })
})
