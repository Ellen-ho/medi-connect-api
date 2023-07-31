import { mock } from 'jest-mock-extended'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { GetBloodPressureRecordsUseCase } from './GetBloodPressureRecordsUseCase'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { User, UserRoleType } from '../../domain/user/User'
import {
  ConsultAppointment,
  ConsultAppointmentStatusType,
} from '../../domain/consultation/ConsultAppointment'
import { GenderType, Patient } from '../../domain/patient/Patient'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { Doctor } from '../../domain/doctor/Doctor'
import { DoctorTimeSlot } from '../../domain/consultation/DoctorTimeSlot'

describe('Unit test: GetBloodPressureRecordsUseCase', () => {
  const mockBloodPressureRecordRepo = mock<IBloodPressureRecordRepository>()
  const mockPatientRepo = mock<IPatientRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()
  const mockConsultAppointmentRepo = mock<IConsultAppointmentRepository>()

  const getBloodPressureRecordsUseCase = new GetBloodPressureRecordsUseCase(
    mockBloodPressureRecordRepo,
    mockPatientRepo,
    mockDoctorRepo,
    mockConsultAppointmentRepo
  )

  const mockedDate = new Date('2023-06-18T13:18:00.155Z')
  jest.spyOn(global, 'Date').mockImplementation(() => mockedDate)

  afterEach(() => {
    jest.resetAllMocks()
  })

  const mockAppointmentDoctor = new Doctor({
    id: 'doctor1',
    avatar: null,
    firstName: 'John',
    lastName: 'Doe',
    gender: GenderType.MALE,
    aboutMe: 'Lorem ipsum dolor sit amet',
    languagesSpoken: ['English', 'Spanish'],
    specialties: [
      MedicalSpecialtyType.CARDIOLOGY,
      MedicalSpecialtyType.NEUROLOGY,
    ],
    careerStartDate: new Date('2010-01-01T13:18:00.155Z'),
    officePracticalLocation: {
      line1: '123 Main St',
      city: 'New York',
      country: 'United States',
      countryCode: 'US',
    },
    education: ['Medical School, University of XYZ'],
    awards: ['Best Doctor Award 2021'],
    affiliations: ['Medical Association XYZ'],
    createdAt: mockedDate,
    updatedAt: mockedDate,
    user: new User({
      id: 'doctor1',
      email: 'doctor1@gmail.com',
      displayName: 'Test DOCTOR',
      role: UserRoleType.DOCTOR,
      hashedPassword: 'hashedPassword',
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  })

  const mockTargetPatient = new Patient({
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
    medicineUsage: null,
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

  const mockDoctorTimeSlot = new DoctorTimeSlot({
    id: 'timeslot1',
    doctorId: 'doctor1',
    startAt: new Date('2023-06-20T09:00:00.000Z'),
    endAt: new Date('2023-06-20T10:00:00.000Z'),
    createdAt: new Date('2023-05-20T10:00:00.000Z'),
    updatedAt: new Date('2023-05-20T10:00:00.000Z'),
    deletedAt: null,
    availability: false,
  })

  const mockUpComingAppointments: ConsultAppointment[] = [
    new ConsultAppointment({
      id: 'appointment1',
      meetingLink: 'https://example.com/meeting',
      patientId: 'patient1',
      doctorTimeSlot: mockDoctorTimeSlot,
      status: ConsultAppointmentStatusType.UPCOMING,
      createdAt: new Date('2023-06-19T10:00:00.000Z'),
      updatedAt: new Date('2023-06-19T11:00:00.000Z'),
    }),
  ]

  const mockBloodPressureRecords = {
    total_counts: 2,
    patientData: {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-06-20T09:00:00.000Z'),
      gender: GenderType.MALE,
    },
    recordsData: [
      {
        id: 'r1',
        date: new Date('2023-06-18T13:18:00.155Z'),
        systolicBloodPressure: 120,
        diastolicBloodPressure: 80,
      },
    ],
  }
  it('should throw AuthorizationError when the current doctor does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: 'doctor2',
        email: 'doctor2@gmail.com',
        displayName: 'Test DOCTOR2',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      targetPatientId: 'patient1',
    }
    mockBloodPressureRecordRepo.findByPatientIdAndCountAll.mockResolvedValue(
      mockBloodPressureRecords
    )
    mockDoctorRepo.findByUserId.mockResolvedValue(null)
    await expect(
      getBloodPressureRecordsUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(
      mockBloodPressureRecordRepo.findByPatientIdAndCountAll
    ).toHaveBeenCalledWith(mockRequest.targetPatientId, 10, 0)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })
  it('should throw AuthorizationError when the current doctor does not be appointed by this patient', async () => {
    const mockRequest = {
      user: new User({
        id: 'doctor2',
        email: 'doctor@gmail.com',
        displayName: 'Test DOCTOR2',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      targetPatientId: 'patient1',
    }
    mockBloodPressureRecordRepo.findByPatientIdAndCountAll.mockResolvedValue(
      mockBloodPressureRecords
    )
    mockDoctorRepo.findByUserId.mockResolvedValue(
      new Doctor({
        id: 'doctor2',
        avatar: null,
        firstName: 'Tim',
        lastName: 'Wang',
        gender: GenderType.MALE,
        aboutMe: 'Lorem ipsum dolor sit amet',
        languagesSpoken: ['English', 'Spanish'],
        specialties: [
          MedicalSpecialtyType.CARDIOLOGY,
          MedicalSpecialtyType.NEUROLOGY,
        ],
        careerStartDate: new Date('2010-01-01T13:18:00.155Z'),
        officePracticalLocation: {
          line1: '123 Main St',
          city: 'New York',
          country: 'United States',
          countryCode: 'US',
        },
        education: ['Medical School, University of XYZ'],
        awards: ['Best Doctor Award 2021'],
        affiliations: ['Medical Association XYZ'],
        createdAt: mockedDate,
        updatedAt: mockedDate,
        user: new User({
          id: 'doctor2',
          email: 'doctor2@gmail.com',
          displayName: 'Test DOCTOR2',
          role: UserRoleType.DOCTOR,
          hashedPassword: 'hashedPassword',
          createdAt: mockedDate,
          updatedAt: mockedDate,
        }),
      })
    )
    mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus.mockResolvedValue(
      []
    )
    await expect(
      getBloodPressureRecordsUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(
      mockBloodPressureRecordRepo.findByPatientIdAndCountAll
    ).toHaveBeenCalledWith(mockRequest.targetPatientId, 10, 0)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus
    ).toHaveBeenCalledWith(mockRequest.targetPatientId, mockRequest.user.id, [
      ConsultAppointmentStatusType.UPCOMING,
    ])
  })
  it('should throw AuthorizationError when patient who made the appointment does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: 'doctor1',
        email: 'doctor1@gmail.com',
        displayName: 'Test DOCTOR',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      targetPatientId: 'patient2',
    }
    mockBloodPressureRecordRepo.findByPatientIdAndCountAll.mockResolvedValue(
      mockBloodPressureRecords
    )
    mockDoctorRepo.findByUserId.mockResolvedValue(mockAppointmentDoctor)
    mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus.mockResolvedValue(
      mockUpComingAppointments
    )
    mockPatientRepo.findById.mockResolvedValue(null)
    await expect(
      getBloodPressureRecordsUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(
      mockBloodPressureRecordRepo.findByPatientIdAndCountAll
    ).toHaveBeenCalledWith(mockRequest.targetPatientId, 10, 0)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockAppointmentDoctor.id
    )
    expect(
      mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus
    ).toHaveBeenCalledWith(
      mockRequest.targetPatientId,
      mockAppointmentDoctor.id,
      [ConsultAppointmentStatusType.UPCOMING]
    )

    expect(mockPatientRepo.findById).toHaveBeenCalledWith(
      mockRequest.targetPatientId
    )
  })
  it('should return the blood pressure records and related data when valid request is provided', async () => {
    const mockRequest = {
      user: new User({
        id: 'doctor1',
        email: 'doctor1@gmail.com',
        displayName: 'Test DOCTOR',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      targetPatientId: 'patient1',
    }

    mockBloodPressureRecordRepo.findByPatientIdAndCountAll.mockResolvedValue(
      mockBloodPressureRecords
    )
    mockDoctorRepo.findByUserId.mockResolvedValue(mockAppointmentDoctor)
    mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus.mockResolvedValue(
      mockUpComingAppointments
    )
    mockPatientRepo.findById.mockResolvedValue(mockTargetPatient)

    const expectedResponse = {
      patientData: {
        firstName: mockTargetPatient.firstName,
        lastName: mockTargetPatient.lastName,
        birthDate: mockTargetPatient.birthDate,
        gender: mockTargetPatient.gender,
      },
      recordsData: mockBloodPressureRecords.recordsData,
      pagination: {
        pages: [1],
        totalPage: 1,
        currentPage: 1,
        prev: 1,
        next: 1,
      },
    }

    const response = await getBloodPressureRecordsUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus
    ).toHaveBeenCalledWith(mockRequest.targetPatientId, mockRequest.user.id, [
      ConsultAppointmentStatusType.UPCOMING,
    ])
    expect(mockPatientRepo.findById).toHaveBeenCalledWith(
      mockRequest.targetPatientId
    )
    expect(
      mockBloodPressureRecordRepo.findByPatientIdAndCountAll
    ).toHaveBeenCalledWith(mockRequest.targetPatientId, 10, 0)
  })
})
