import { mock } from 'jest-mock-extended'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import MockDate from 'mockdate'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { GetDoctorConsultAppointmentsUseCase } from './GetDoctorConsultAppointmentsUseCase'
import dayjs from 'dayjs'
import { GenderType } from '../../domain/patient/Patient'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { Doctor } from '../../domain/doctor/Doctor'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'

describe('Unit test: GetDoctorConsultAppointmentsUseCase', () => {
  const mockConsultAppointmentRepo = mock<IConsultAppointmentRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()

  const getDoctorConsultAppointmentsUseCase =
    new GetDoctorConsultAppointmentsUseCase(
      mockConsultAppointmentRepo,
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

  it('should throw AuthorizationError when the doctor does not exit', async () => {
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
    }
    mockDoctorRepo.findByUserId.mockResolvedValue(null)
    await expect(
      getDoctorConsultAppointmentsUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })

  it('should get the appointments list when valid request is provided', async () => {
    const currentMonthStartDate = dayjs(mockedDate).startOf('month')
    const currentMonthEndDate = dayjs(mockedDate).endOf('month')

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
    }
    const mockUpcomingAppointments = [
      {
        appointmentId: '98e647d7-259c-4961-8102-97bb582422de',
        status: ConsultAppointmentStatusType.UPCOMING,
        doctorTimeSlot: {
          doctorId: 'doctor1',
          startAt: new Date('2023-06-19T09:00:00'),
          endAt: new Date('2023-06-19T09:30:00'),
        },
        patient: {
          id: '2e9915e3-43c9-4f3c-9e52-59c83bb22f36',
          firstName: 'John',
          lastName: 'Lin',
        },
        meetingLink: 'https://example.com/meeting1',
      },
    ]
    const mockCompletedAppointments = [
      {
        appointmentId: '66f547d7-259c-4961-8102-97bb582422de',
        status: ConsultAppointmentStatusType.COMPLETED,
        doctorTimeSlot: {
          doctorId: 'doctor1',
          startAt: new Date('2023-06-08T14:00:00'),
          endAt: new Date('2023-06-08T14:30:00'),
        },
        patient: {
          id: '67f547d7-259c-4961-8102-97bb582422de',
          firstName: 'Jane',
          lastName: 'Smith',
        },
        meetingLink: null,
      },
    ]
    const mockCanceledAppointments = [
      {
        appointmentId: '99f547d7-259c-4961-8102-97bb582422de',
        status: ConsultAppointmentStatusType.PATIENT_CANCELED,
        doctorTimeSlot: {
          doctorId: 'doctor1',
          startAt: new Date('2023-06-15T14:00:00'),
          endAt: new Date('2023-06-15T15:00:00'),
        },
        patient: {
          id: '88f547d7-259c-4961-8102-97bb582422de',
          firstName: 'Amy',
          lastName: 'Smith',
        },
        meetingLink: null,
      },
    ]
    mockDoctorRepo.findByUserId.mockResolvedValue(mockExistingDoctor)
    mockConsultAppointmentRepo.findByDoctorIdAndStatusWithinDateRange
      .mockResolvedValueOnce(mockUpcomingAppointments)
      .mockResolvedValueOnce(mockCompletedAppointments)
      .mockResolvedValueOnce(mockCanceledAppointments)

    const expectedResponse = {
      upcomingAppointments: mockUpcomingAppointments,
      completedAppointments: mockCompletedAppointments,
      canceledAppointments: mockCanceledAppointments,
    }

    const response = await getDoctorConsultAppointmentsUseCase.execute(
      mockRequest
    )
    expect(response).toEqual(expectedResponse)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByDoctorIdAndStatusWithinDateRange
    ).toHaveBeenCalledWith(
      mockRequest.user.id,
      [ConsultAppointmentStatusType.UPCOMING],
      mockedDate,
      currentMonthEndDate.toDate()
    )
    expect(
      mockConsultAppointmentRepo.findByDoctorIdAndStatusWithinDateRange
    ).toHaveBeenCalledWith(
      mockRequest.user.id,
      [ConsultAppointmentStatusType.COMPLETED],
      currentMonthStartDate.toDate(),
      currentMonthEndDate.toDate()
    )
    expect(
      mockConsultAppointmentRepo.findByDoctorIdAndStatusWithinDateRange
    ).toHaveBeenCalledWith(
      mockRequest.user.id,
      [ConsultAppointmentStatusType.PATIENT_CANCELED],
      currentMonthStartDate.toDate(),
      currentMonthEndDate.toDate()
    )
  })
})
