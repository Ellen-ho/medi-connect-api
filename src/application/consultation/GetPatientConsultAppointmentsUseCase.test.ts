import { mock } from 'jest-mock-extended'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { GetPatientConsultAppointmentsUseCase } from './GetPatientConsultAppointmentsUseCase'
import MockDate from 'mockdate'
import { GenderType, Patient } from '../../domain/patient/Patient'
import { User, UserRoleType } from '../../domain/user/User'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import dayjs from 'dayjs'
import { ConsultAppointmentStatusType } from '../../domain/consultation/ConsultAppointment'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'

describe('Unit test: GetPatientConsultAppointmentsUseCase', () => {
  const mockConsultAppointmentRepo = mock<IConsultAppointmentRepository>()
  const mockPatientRepo = mock<IPatientRepository>()

  const getPatientConsultAppointmentsUseCase =
    new GetPatientConsultAppointmentsUseCase(
      mockConsultAppointmentRepo,
      mockPatientRepo
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
    }
    mockPatientRepo.findByUserId.mockResolvedValue(null)
    await expect(
      getPatientConsultAppointmentsUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })

  it('should get the appointments list when valid request is provided', async () => {
    const currentMonthStartDate = dayjs(mockedDate).startOf('month')
    const currentMonthEndDate = dayjs(mockedDate).endOf('month')

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
    }
    const mockUpcomingAppointments = [
      {
        appointmentId: '1000001',
        patientId: 'patient1',
        status: ConsultAppointmentStatusType.UPCOMING,
        doctorTimeSlot: {
          startAt: new Date('2023-06-19T10:00:00'),
          endAt: new Date('2023-06-19T11:00:00'),
        },
        doctor: {
          firstName: 'John',
          lastName: 'Doe',
          specialties: [MedicalSpecialtyType.CARDIOLOGY],
        },
        meetingLink: 'https://example.com/meeting1',
        cancelAvailability: false,
      },
    ]
    const mockCompletedAppointments = [
      {
        appointmentId: '10001',
        patientId: 'patient2',
        status: ConsultAppointmentStatusType.COMPLETED,
        doctorTimeSlot: {
          startAt: new Date('2023-06-07T14:00:00'),
          endAt: new Date('2023-06-07T15:00:00'),
        },
        doctor: {
          firstName: 'Jane',
          lastName: 'Smith',
          specialties: [MedicalSpecialtyType.DERMATOLOGY],
        },
        meetingLink: null,
        cancelAvailability: false,
      },
    ]
    const mockCanceledAppointments = [
      {
        appointmentId: '1001',
        patientId: 'patient3',
        status: ConsultAppointmentStatusType.PATIENT_CANCELED,
        doctorTimeSlot: {
          startAt: new Date('2023-06-09T09:00:00'),
          endAt: new Date('2023-06-09T10:00:00'),
        },
        doctor: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          specialties: [MedicalSpecialtyType.INTERNAL_MEDICINE],
        },
        meetingLink: null,
        cancelAvailability: false,
      },
    ]
    mockPatientRepo.findByUserId.mockResolvedValue(mockExistingPatient)
    mockConsultAppointmentRepo.findByPatientIdAndStatusWithinDateRange
      .mockResolvedValueOnce(mockUpcomingAppointments)
      .mockResolvedValueOnce(mockCompletedAppointments)
      .mockResolvedValueOnce(mockCanceledAppointments)

    const expectedResponse = {
      upcomingAppointments: mockUpcomingAppointments,
      completedAppointments: mockCompletedAppointments,
      canceledAppointments: mockCanceledAppointments,
    }

    const response = await getPatientConsultAppointmentsUseCase.execute(
      mockRequest
    )
    expect(response).toEqual(expectedResponse)
    expect(mockPatientRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByPatientIdAndStatusWithinDateRange
    ).toHaveBeenCalledWith(
      mockRequest.user.id,
      [ConsultAppointmentStatusType.UPCOMING],
      mockedDate,
      currentMonthEndDate.toDate()
    )
    expect(
      mockConsultAppointmentRepo.findByPatientIdAndStatusWithinDateRange
    ).toHaveBeenCalledWith(
      mockRequest.user.id,
      [ConsultAppointmentStatusType.COMPLETED],
      currentMonthStartDate.toDate(),
      currentMonthEndDate.toDate()
    )
    expect(
      mockConsultAppointmentRepo.findByPatientIdAndStatusWithinDateRange
    ).toHaveBeenCalledWith(
      mockRequest.user.id,
      [ConsultAppointmentStatusType.PATIENT_CANCELED],
      currentMonthStartDate.toDate(),
      currentMonthEndDate.toDate()
    )
  })
})
