import { PostgresDatabase } from '../../../infrastructure/database/PostgresDatabase'
import { AnswerAgreementRepository } from '../../../infrastructure/entities/question/AnswerAgreementRepository'
import {
  CancelAnswerAgreementRequest,
  CancelAnswerAgreementUseCase,
} from '../CancelAnswerAgreementUseCase'
import { UserRepository } from '../../../infrastructure/entities/user/UserRepository'
import { DoctorRepository } from '../../../infrastructure/entities/doctor/DoctorRepository'
import { UserFactory } from '../../../domain/user/test/UserFactory'
import { UserRoleType } from '../../../domain/user/User'
import { DoctorFactory } from '../../../domain/doctor/test/DoctorFactory'
import { AnswerAgreementFactory } from '../../../domain/question/test/AnserAgreementFactory'
import { PatientQuestionAnswerFactory } from '../../../domain/question/test/PatientQuestionAnswerFactory'
import { PatientQuestionAnswerRepository } from '../../../infrastructure/entities/question/PatientQuestionAnswerRepository'
import { PatientQuestionRepository } from '../../../infrastructure/entities/question/PatientQuestionRepository'
import { PatientRepository } from '../../../infrastructure/entities/patient/PatientRepository'
import { PatientFactory } from '../../../domain/patient/test/PatientFactory'
import { PatientQuestionFactory } from '../../../domain/question/test/PatientQuestionFactory'
import { AuthorizationError } from '../../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../../infrastructure/error/NotFoundError'
import { NotificationHelper } from '../../notification/NotificationHelper'
import { NotificationRepository } from '../../../infrastructure/entities/notification/NotificationRepository'
import { UuidService } from '../../../infrastructure/utils/UuidService'
import SocketService from '../../../infrastructure/network/SocketService'

xdescribe('Integration test: CancelAnswerAgreementUseCase', () => {
  let database: PostgresDatabase
  let answerAgreementRepo: AnswerAgreementRepository
  let doctorRepo: DoctorRepository
  let patientRepo: PatientRepository
  let patientQuestionRepo: PatientQuestionRepository
  let patientQuestionAnswerRepo: PatientQuestionAnswerRepository
  let useCase: CancelAnswerAgreementUseCase
  let userRepo: UserRepository
  let notificationRepo: NotificationRepository
  let uuidService: UuidService
  let socketService: SocketService
  let notificationHelper: NotificationHelper

  const mockAgreedDoctorUser = UserFactory.build({
    role: UserRoleType.DOCTOR,
    hashedPassword: 'hashedPassword',
    createdAt: new Date('2023-06-18T13:18:00.155Z'),
    updatedAt: new Date('2023-06-18T13:18:00.155Z'),
  })
  const mockAnswerDoctorUser = UserFactory.build({
    role: UserRoleType.DOCTOR,
    hashedPassword: 'hashedPassword',
    createdAt: new Date('2023-06-18T13:18:00.155Z'),
    updatedAt: new Date('2023-06-18T13:18:00.155Z'),
  })
  const mockPatientUser = UserFactory.build({
    role: UserRoleType.DOCTOR,
    hashedPassword: 'hashedPassword',
    createdAt: new Date('2023-06-18T13:18:00.155Z'),
    updatedAt: new Date('2023-06-18T13:18:00.155Z'),
  })

  const mockAgreedDoctor = DoctorFactory.build({
    id: '4aa1a113-d1f8-49b5-8fb3-73f8324ff251',
    user: mockAgreedDoctorUser,
  })

  const mockAnswerDoctor = DoctorFactory.build({
    id: '00cec3d5-9883-4da5-81b7-2e43b63ec038',
    user: mockAnswerDoctorUser,
  })

  const mockPatient = PatientFactory.build({
    user: mockPatientUser,
  })

  const mockQuestion = PatientQuestionFactory.build({
    id: '7b5c63b3-463e-48e3-8435-ebd44fe10bff',
    askerId: mockPatient.id,
  })

  const mockAnswer = PatientQuestionAnswerFactory.build({
    id: '572c900a-3650-4851-8971-f234a100a43e',
    patientQuestionId: '7b5c63b3-463e-48e3-8435-ebd44fe10bff',
    doctorId: '00cec3d5-9883-4da5-81b7-2e43b63ec038',
    createdAt: new Date('2023-06-17T13:18:00.155Z'),
    updatedAt: new Date('2023-06-17T13:18:00.155Z'),
  })

  beforeAll(async () => {
    // connect to test db
    database = await PostgresDatabase.getInstance()
    // create repos and service
    doctorRepo = new DoctorRepository(database.getDataSource())
    patientRepo = new PatientRepository(database.getDataSource())

    patientQuestionRepo = new PatientQuestionRepository(
      database.getDataSource()
    )
    patientQuestionAnswerRepo = new PatientQuestionAnswerRepository(
      database.getDataSource()
    )
    answerAgreementRepo = new AnswerAgreementRepository(
      database.getDataSource()
    )
    userRepo = new UserRepository(database.getDataSource())

    notificationRepo = new NotificationRepository(database.getDataSource())
    uuidService = new UuidService()
    notificationHelper = new NotificationHelper(
      notificationRepo,
      uuidService,
      socketService
    )

    useCase = new CancelAnswerAgreementUseCase(
      answerAgreementRepo,
      doctorRepo,
      patientQuestionAnswerRepo,
      notificationHelper
    )
  }, 300000)

  beforeEach(async () => {})

  afterEach(async () => {
    await answerAgreementRepo.clear()
    await patientQuestionAnswerRepo.clear()
    await patientQuestionRepo.clear()
    await notificationRepo.clear()
    await patientRepo.clear()
    await doctorRepo.clear()
    await userRepo.clear()
  })

  afterAll(async () => {
    await database.disconnect()
  })

  const mockTargetAgreementId = '771af7fd-4b22-45c4-a5f2-080735145a99'

  const mockAgreement = AnswerAgreementFactory.build({
    id: mockTargetAgreementId,
    answerId: '572c900a-3650-4851-8971-f234a100a43e',
    agreedDoctorId: mockAgreedDoctor.id,
    createdAt: new Date('2023-06-18T13:18:00.155Z'),
    updatedAt: new Date('2023-06-18T13:18:00.155Z'),
  })

  it('should cancel agreement and related data', async () => {
    await userRepo.save(mockAgreedDoctorUser)
    await userRepo.save(mockAnswerDoctorUser)
    await userRepo.save(mockPatientUser)
    await doctorRepo.save(mockAgreedDoctor)
    await doctorRepo.save(mockAnswerDoctor)
    await patientRepo.save(mockPatient)
    await patientQuestionRepo.save(mockQuestion)
    await patientQuestionAnswerRepo.save(mockAnswer)
    await answerAgreementRepo.save(mockAgreement)

    const request: CancelAnswerAgreementRequest = {
      user: mockAgreedDoctorUser,
      answerId: mockAgreement.answerId,
    }
    const result = await useCase.execute(request)
    const expected = {
      totalAgreedDoctorCounts: '0',
      agreedDoctorAvatars: [],
    }
    expect(result).toEqual(expected)
  })
  it('should throw AuthorizationError if doctor does not exit', async () => {
    const mockDoctorUser = UserFactory.build({
      role: UserRoleType.DOCTOR,
      hashedPassword: 'hashedPassword',
      createdAt: new Date('2023-06-18T13:18:00.155Z'),
      updatedAt: new Date('2023-06-18T13:18:00.155Z'),
    })
    const mockAgreement = AnswerAgreementFactory.build({
      id: mockTargetAgreementId,
      answerId: '572c900a-3650-4851-8971-f234a100a43e',
      agreedDoctorId: mockAgreedDoctor.id,
      createdAt: new Date('2023-06-18T13:18:00.155Z'),
      updatedAt: new Date('2023-06-18T13:18:00.155Z'),
    })

    await userRepo.save(mockAgreedDoctorUser)
    await userRepo.save(mockAnswerDoctorUser)
    await userRepo.save(mockPatientUser)
    await doctorRepo.save(mockAnswerDoctor)
    await doctorRepo.save(mockAgreedDoctor)
    await patientRepo.save(mockPatient)
    await patientQuestionRepo.save(mockQuestion)
    await patientQuestionAnswerRepo.save(mockAnswer)
    await answerAgreementRepo.save(mockAgreement)

    const request: CancelAnswerAgreementRequest = {
      user: mockDoctorUser,
      answerId: mockAgreement.answerId,
    }
    await expect(useCase.execute(request)).rejects.toThrow(AuthorizationError)
  })
  it('should throw NotFoundError if agreement does not exit', async () => {
    await userRepo.save(mockAgreedDoctorUser)
    await userRepo.save(mockAnswerDoctorUser)
    await userRepo.save(mockPatientUser)
    await doctorRepo.save(mockAnswerDoctor)
    await doctorRepo.save(mockAgreedDoctor)
    await patientRepo.save(mockPatient)
    await patientQuestionRepo.save(mockQuestion)
    await patientQuestionAnswerRepo.save(mockAnswer)
    const request: CancelAnswerAgreementRequest = {
      user: mockAgreedDoctorUser,
      answerId: 'bdd6b872-6424-416d-984c-99260115ef7a',
    }
    await expect(useCase.execute(request)).rejects.toThrow(NotFoundError)
  })
})
