import { mock } from 'jest-mock-extended'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IMeetingLinkRepository } from '../../domain/meeting/interface/IMeetingLinkRepository'
import { INotificationHelper } from '../notification/NotificationHelper'
import { IExecutor, IRepositoryTx } from '../../domain/shared/IRepositoryTx'
import { IScheduler } from '../../infrastructure/network/Scheduler'
import { CancelConsultAppointmentUseCase } from './CancelConsultAppointmentUseCase'
import MockDate from 'mockdate'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { GenderType, Patient } from '../../domain/patient/Patient'
import {
  ConsultAppointment,
  ConsultAppointmentStatusType,
} from '../../domain/consultation/ConsultAppointment'
import { DoctorTimeSlot } from '../../domain/consultation/DoctorTimeSlot'
import { Doctor } from '../../domain/doctor/Doctor'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import {
  MeetingLink,
  MeetingLinkStatus,
} from '../../domain/meeting/MeetingLink'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

describe('Unit test: CancelConsultAppointmentUseCase', () => {
  const mockConsultAppointmentRepo = mock<IConsultAppointmentRepository>()
  const mockPatientRepo = mock<IPatientRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()
  const mockMeetingLinkRepo = mock<IMeetingLinkRepository>()
  const mockNotifictionHelper = mock<INotificationHelper>()
  const mockTx = mock<IRepositoryTx>()
  const mockTxExecutor = mock<IExecutor>()
  const mockScheduler = mock<IScheduler>()

  const cancelConsultAppointmentUseCase = new CancelConsultAppointmentUseCase(
    mockConsultAppointmentRepo,
    mockPatientRepo,
    mockDoctorRepo,
    mockMeetingLinkRepo,
    mockNotifictionHelper,
    mockScheduler
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

  const mockConsultAppointment = new ConsultAppointment({
    id: 'appointment1',
    meetingLink: 'https://example.com/meeting',
    patientId: 'patient1',
    doctorTimeSlot: new DoctorTimeSlot({
      id: 'timeslot1',
      doctorId: 'doctor1',
      startAt: new Date('2023-06-20T10:00:00'),
      endAt: new Date('2023-06-20T11:00:00'),
      createdAt: new Date('2023-05-27T09:00:00'),
      updatedAt: new Date('2023-05-27T09:00:00'),
      deletedAt: null,
      availability: false,
    }),
    status: ConsultAppointmentStatusType.UPCOMING,
    createdAt: new Date('2023-06-10T10:00:00'),
    updatedAt: new Date('2023-06-10T10:00:00'),
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

  it('should throw AuthorizationError when the patient does not exit', async () => {
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
      consultAppointmentId: 'appointment1',
    }

    mockPatientRepo.findByUserId.mockResolvedValue(null)
    await expect(
      cancelConsultAppointmentUseCase.execute(mockRequest, mockTx)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })
  it('should throw NotFoundError when the appointment does not exit', async () => {
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
      consultAppointmentId: 'appointment2',
    }
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockConsultAppointmentRepo.findByIdAndPatientId.mockResolvedValue(null)
    await expect(
      cancelConsultAppointmentUseCase.execute(mockRequest, mockTx)
    ).rejects.toThrow(NotFoundError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByIdAndPatientId
    ).toHaveBeenCalledWith(
      mockRequest.consultAppointmentId,
      mockExistingPatient.id
    )
  })
  it('should throw AuthorizationError when the appointed doctor does not exit', async () => {
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
      consultAppointmentId: 'appointment1',
    }
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockConsultAppointmentRepo.findByIdAndPatientId.mockResolvedValue(
      mockConsultAppointment
    )
    mockDoctorRepo.findById.mockResolvedValue(null)
    await expect(
      cancelConsultAppointmentUseCase.execute(mockRequest, mockTx)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByIdAndPatientId
    ).toHaveBeenCalledWith(
      mockRequest.consultAppointmentId,
      mockExistingPatient.id
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(
      mockConsultAppointment.doctorTimeSlot.doctorId
    )
  })
  it('should throw AuthorizationError when the appointed be canceled within one day', async () => {
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
      consultAppointmentId: 'appointment1',
    }

    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockConsultAppointmentRepo.findByIdAndPatientId.mockResolvedValue(
      mockConsultAppointment
    )
    mockDoctorRepo.findById.mockResolvedValue(null)
    await expect(
      cancelConsultAppointmentUseCase.execute(mockRequest, mockTx)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByIdAndPatientId
    ).toHaveBeenCalledWith(
      mockRequest.consultAppointmentId,
      mockExistingPatient.id
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(
      mockConsultAppointment.doctorTimeSlot.doctorId
    )
  })
  it('should cancel the appointment when the valid request is provided', async () => {
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
      consultAppointmentId: 'appointment1',
    }
    const mockMeetingLink = new MeetingLink({
      id: 'link1',
      link: 'https://example.com/meeting',
      status: MeetingLinkStatus.AVAILABLE,
      createdAt: new Date('2023-06-10T10:00:00'),
      updatedAt: new Date('2023-06-10T10:00:00'),
    })
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockConsultAppointmentRepo.findByIdAndPatientId.mockResolvedValue(
      mockConsultAppointment
    )
    mockDoctorRepo.findById.mockResolvedValue(mockExistingDoctor)
    mockTx.start.mockResolvedValue()
    mockTx.getExecutor.mockImplementation(() => mockTxExecutor)
    mockMeetingLinkRepo.findByLink.mockResolvedValue(mockMeetingLink)
    mockMeetingLinkRepo.save.mockResolvedValue()
    mockConsultAppointmentRepo.delete.mockResolvedValue()
    mockScheduler.cancelJob.mockImplementation()
    mockTx.end.mockResolvedValue()
    mockNotifictionHelper.createNotification.mockResolvedValue()
    const expectedResponse = {
      consultAppointmentId: mockRequest.consultAppointmentId,
      status: ConsultAppointmentStatusType.PATIENT_CANCELED,
    }

    const response = await cancelConsultAppointmentUseCase.execute(
      mockRequest,
      mockTx
    )

    expect(response).toEqual(expectedResponse)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByIdAndPatientId
    ).toHaveBeenCalledWith(
      mockRequest.consultAppointmentId,
      mockExistingPatient.id
    )
    expect(mockDoctorRepo.findById).toHaveBeenCalledWith(
      mockConsultAppointment.doctorTimeSlot.doctorId
    )
    expect(mockTx.start).toHaveBeenCalled()
    expect(mockTx.getExecutor).toHaveBeenCalled()
    expect(mockMeetingLinkRepo.findByLink).toHaveBeenCalledWith(
      mockMeetingLink.link
    )
    expect(mockMeetingLinkRepo.save).toHaveBeenCalled()
    expect(mockConsultAppointmentRepo.delete).toHaveBeenCalledWith(
      mockConsultAppointment.id,
      mockTxExecutor
    )
    expect(mockScheduler.cancelJob).toHaveBeenCalledWith(
      `${mockConsultAppointment.id}_notification`
    )
    expect(mockTx.end).toHaveBeenCalled()
    expect(mockNotifictionHelper.createNotification).toHaveBeenCalled()
  })
})
