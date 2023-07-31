import { mock } from 'jest-mock-extended'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { User, UserRoleType } from '../../domain/user/User'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IConsultAppointmentRepository } from '../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { Doctor, GenderType } from '../../domain/doctor/Doctor'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { Patient } from '../../domain/patient/Patient'
import { DoctorTimeSlot } from '../../domain/consultation/DoctorTimeSlot'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { GetSingleBloodPressureRecordUseCase } from './GetSingleBloodPressureRecordUsecase'
import { BloodPressureRecord } from '../../domain/record/BloodPressureRecord'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import {
  ConsultAppointment,
  ConsultAppointmentStatusType,
} from '../../domain/consultation/ConsultAppointment'

describe('Unit test: GetSingleBloodPressureRecordUseCase', () => {
  const mockBloodPressureRecordRepo = mock<IBloodPressureRecordRepository>()
  const mockPatientRepo = mock<IPatientRepository>()
  const mockDoctorRepo = mock<IDoctorRepository>()
  const mockConsultAppointmentRepo = mock<IConsultAppointmentRepository>()

  const getSingleBloodPressureRecordUseCase =
    new GetSingleBloodPressureRecordUseCase(
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
      createdAt: mockedDate,
      updatedAt: mockedDate,
    }),
  ]

  const mockBloodPressureRecord = new BloodPressureRecord({
    id: 'record1',
    bloodPressureDate: new Date('2023-06-18T13:18:00.155Z'),
    systolicBloodPressure: 120,
    diastolicBloodPressure: 80,
    heartBeat: 76,
    bloodPressureNote: 'no',
    createdAt: mockedDate,
    updatedAt: mockedDate,
    patientId: 'patient1',
  })

  it('should throw NotFoundError when the blood pressure record does not exist', async () => {
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
      bloodPressureRecordId: 'record2',
      targetPatientId: 'p1',
    }
    mockBloodPressureRecordRepo.findById.mockResolvedValue(null)
    await expect(
      getSingleBloodPressureRecordUseCase.execute(mockRequest)
    ).rejects.toThrow(NotFoundError)
    expect(mockBloodPressureRecordRepo.findById).toHaveBeenCalledWith(
      mockRequest.bloodPressureRecordId
    )
  })

  it('should throw AuthorizationError when the currentDoctor does not exist', async () => {
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
      bloodPressureRecordId: 'record1',
      targetPatientId: 'p1',
    }
    mockBloodPressureRecordRepo.findById.mockResolvedValue(
      mockBloodPressureRecord
    )
    mockDoctorRepo.findByUserId.mockResolvedValue(null)
    await expect(
      getSingleBloodPressureRecordUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockBloodPressureRecordRepo.findById).toHaveBeenCalledWith(
      mockRequest.bloodPressureRecordId
    )
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
  })
  it('should throw AuthorizationError when the current doctor does not be appointed by this patient', async () => {
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
      bloodPressureRecordId: 'record1',
      targetPatientId: 'p1',
    }
    mockBloodPressureRecordRepo.findById.mockResolvedValue(
      mockBloodPressureRecord
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
      getSingleBloodPressureRecordUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockBloodPressureRecordRepo.findById).toHaveBeenCalledWith(
      mockRequest.bloodPressureRecordId
    )
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus
    ).toHaveBeenCalledWith(mockTargetPatient.id, mockRequest.user.id, [
      ConsultAppointmentStatusType.UPCOMING,
    ])
  })
  it('should throw AuthorizationError when patient who made the appointment does not exist', async () => {
    const mockRequest = {
      user: new User({
        id: 'doctor1',
        email: 'doctor1@gmail.com',
        displayName: 'Test DOCTOR1',
        role: UserRoleType.DOCTOR,
        hashedPassword: 'hashedPassword',
        createdAt: mockedDate,
        updatedAt: mockedDate,
      }),
      bloodPressureRecordId: 'record1',
      targetPatientId: 'p1',
    }
    mockBloodPressureRecordRepo.findById.mockResolvedValue(
      mockBloodPressureRecord
    )
    mockDoctorRepo.findByUserId.mockResolvedValue(mockAppointmentDoctor)
    mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus.mockResolvedValue(
      mockUpComingAppointments
    )
    mockPatientRepo.findById.mockResolvedValue(null)
    await expect(
      getSingleBloodPressureRecordUseCase.execute(mockRequest)
    ).rejects.toThrow(AuthorizationError)
    expect(mockBloodPressureRecordRepo.findById).toHaveBeenCalledWith(
      mockRequest.bloodPressureRecordId
    )
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus
    ).toHaveBeenCalledWith(mockTargetPatient.id, mockRequest.user.id, [
      ConsultAppointmentStatusType.UPCOMING,
    ])
    expect(mockPatientRepo.findById).toHaveBeenCalledWith(mockTargetPatient.id)
  })
  it('should return the blood pressure record and related data when valid request is provided', async () => {
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
      bloodPressureRecordId: 'record1',
      targetPatientId: 'p1',
    }
    mockBloodPressureRecordRepo.findById.mockResolvedValue(
      mockBloodPressureRecord
    )
    mockDoctorRepo.findByUserId.mockResolvedValue(mockAppointmentDoctor)
    mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus.mockResolvedValue(
      mockUpComingAppointments
    )
    mockPatientRepo.findById.mockResolvedValue(mockTargetPatient)

    const expectedResponse = {
      data: {
        bloodPressureDate: mockBloodPressureRecord.bloodPressureDate,
        systolicBloodPressure: mockBloodPressureRecord.systolicBloodPressure,
        diastolicBloodPressure: mockBloodPressureRecord.diastolicBloodPressure,
        heartBeat: mockBloodPressureRecord.heartBeat,
        bloodPressureNote: mockBloodPressureRecord.bloodPressureNote,
        createdAt: mockedDate,
        updatedAt: mockedDate,
      },
      recordOwner: {
        firstName: mockTargetPatient.firstName,
        lastName: mockTargetPatient.lastName,
        birthDate: mockTargetPatient.birthDate,
        gender: mockTargetPatient.gender,
      },
    }
    const response = await getSingleBloodPressureRecordUseCase.execute(
      mockRequest
    )

    expect(response).toEqual(expectedResponse)
    expect(mockBloodPressureRecordRepo.findById).toHaveBeenCalledWith(
      mockBloodPressureRecord.id
    )
    expect(mockDoctorRepo.findByUserId).toHaveBeenCalledWith(
      mockRequest.user.id
    )
    expect(
      mockConsultAppointmentRepo.findByPatientIdAndDoctorIdAndStatus
    ).toHaveBeenCalledWith(mockTargetPatient.id, mockRequest.user.id, [
      ConsultAppointmentStatusType.UPCOMING,
    ])
    expect(mockPatientRepo.findById).toHaveBeenCalledWith(mockTargetPatient.id)
  })
})
