import 'reflect-metadata'
import * as path from 'path'
import express, { Express } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { PostgresDatabase } from './infrastructure/database/PostgresDatabase'
import { UuidService } from './infrastructure/utils/UuidService'
import { UserRepository } from './infrastructure/entities/user/UserRepository'
import { GetUserAccountUseCase } from './application/user/GetUserAccountUseCase'
import { CreateUserUseCase } from './application/user/CreateUserUseCase'
import { UserController } from './infrastructure/http/controllers/UserController'
import { UserRoutes } from './infrastructure/http/routes/UserRoutes'
import { MainRoutes } from './infrastructure/http/routes'
import { errorHandler } from './infrastructure/http/middlewares/ErrorHandler'
import { BcryptHashGenerator } from './infrastructure/utils/BcryptHashGenerator'
import { PassportConfig } from './infrastructure/config/passportConfig'
import { PatientRoutes } from './infrastructure/http/routes/PatientRoutes'
import { PatientController } from './infrastructure/http/controllers/PatientController'
import { EditPatientProfileUseCase } from './application/patient/EditPatientProfileUseCase'
import { PatientRepository } from './infrastructure/entities/patient/PatientRepository'
import { RecordRoutes } from './infrastructure/http/routes/RecordRoutes'
import { BloodPressureRecordRepository } from './infrastructure/entities/record/BloodPressureRecordRepository'
import { CreateBloodPressureRecordUseCase } from './application/record/CreateBloodPressureRecordUseCase'
import { EditBloodPressureRecordUseCase } from './application/record/EditBloodPressureRecordUseCase'
import { BloodSugarRecordRepository } from './infrastructure/entities/record/BloodSugarRecordRepository'
import { CreateBloodSugarRecordUseCase } from './application/record/CreateBloodSugarRecordUseCase'
import { EditBloodSugarRecordUseCase } from './application/record/EditBloodSugarRecordUseCase'
import { FoodRecordRepository } from './infrastructure/entities/record/FoodRecordRepository'
import { CreateFoodRecordUseCase } from './application/record/CreateFoodRecordUseCase'
import { EditFoodRecordUseCase } from './application/record/EditFoodRecordUseCase'
import { ExerciseRecordRepository } from './infrastructure/entities/record/ExerciseRecordRepository'
import { CreateExerciseRecordUseCase } from './application/record/CreateExerciseRecordUseCase'
import { EditExerciseRecordUseCase } from './application/record/EditExerciseRecordUseCase'
import { SleepRecordRepository } from './infrastructure/entities/record/SleepRecordRepository'
import { CreateSleepRecordUseCase } from './application/record/CreateSleepRecordUseCase'
import { EditSleepRecordUseCase } from './application/record/EditSleepRecordUseCase'
import { WeightRecordRepository } from './infrastructure/entities/record/WeightRecordRepository'
import { CreateWeightRecordUseCase } from './application/record/CreateWeightRecordUseCase'
import { EditWeightRecordUseCase } from './application/record/EditWeightRecordUseCase'
import { GlycatedHemoglobinRecordRepository } from './infrastructure/entities/record/GlycatedHemoglobinRecordRepository'
import { CreateGlycatedHemoglobinRecordUseCase } from './application/record/CreateGlycatedHemoglobinRecordUseCase'
import { EditGlycatedHemoglobinRecordUseCase } from './application/record/EditGlycatedHemoglobinRecordUseCase'
import { RecordController } from './infrastructure/http/controllers/RecordController'
import { DoctorRoutes } from './infrastructure/http/routes/DoctorRoutes'
import { DoctorController } from './infrastructure/http/controllers/DoctorController'
import { EditDoctorProfileUseCase } from './application/doctor/EditDoctorProfileUseCase'
import { DoctorRepository } from './infrastructure/entities/doctor/DoctorRepository'
import { QuestionRoutes } from './infrastructure/http/routes/QuestionRoutes'
import { QuestionController } from './infrastructure/http/controllers/QuestionController'
import { CreateAnswerAgreementUseCase } from './application/question/CreateAnswerAgreementUseCase'
import { AnswerAgreementRepository } from './infrastructure/entities/question/AnswerAgreementRepository'
import { CancelAnswerAgreementUseCase } from './application/question/CancelAnswerAgreementUseCase'
import { AnswerAppreciationRepository } from './infrastructure/entities/question/AnswerAppreciationRepository'
import { CreateAnswerAppreciationUseCase } from './application/question/CreateAnswerAppreciationUseCase'
import { CancelAnswerAppreciationUseCase } from './application/question/CancelAnswerAppreciationUseCase'
import { PatientQuestionAnswerRepository } from './infrastructure/entities/question/PatientQuestionAnswerRepository'
import { CreatePatientQuestionAnswerUseCase } from './application/question/CreatePatientQuestionAnswerUseCase'
import { CancelPatientQuestionAnswerUseCase } from './application/question/CancelPatientQuestionAnswerUseCase'
import { CreatePatientQuestionUseCase } from './application/question/CreatePatientQuestionUseCase'
import { PatientQuestionRepository } from './infrastructure/entities/question/PatientQuestionRepository'
import { CancelPatientQuestionUseCase } from './application/question/CancelPatientQuestionUsecase'
import { DoctorTimeSlotRepository } from './infrastructure/entities/consultation/DoctorTimeSlotRepository'
import { ConsultAppointmentRepository } from './infrastructure/entities/consultation/ConsultAppointmentRepository'
import { CreateConsultAppointmentUseCase } from './application/consultation/CreateConsultAppointmentUseCase'
import { CreateDoctorTimeSlotUseCase } from './application/consultation/CreateDoctorTimeSlotUseCase'
import { EditDoctorTimeSlotUseCase } from './application/consultation/EditDoctorTimeSlotUseCase'
import { ConsultationController } from './infrastructure/http/controllers/ConsultationController'
import { CancelConsultAppointmentUseCase } from './application/consultation/CancelConsultAppointmentUseCase'
import { ConsultationRoutes } from './infrastructure/http/routes/ConsultationRoutes'
import { GetSingleQuestionUseCase } from './application/question/GetSingleQuestionUseCase'
import { GetQuestionsUseCase } from './application/question/GetQuestionsUsecase'
import { GetSingleExerciseRecordUseCase } from './application/record/GetSingleExerciseRecordUseCase'
import { GetSingleBloodPressureRecordUseCase } from './application/record/GetSingleBloodPressureRecordUsecase'
import { GetSingleBloodSugarRecordUseCase } from './application/record/GetSingleBloodSugarRecordUseCase'
import { GetSingleFoodRecordUseCase } from './application/record/GetSingleFoodRecordUseCase'
import { GetSingleGlycatedHemoglobinRecordUseCase } from './application/record/GetSingleGlycatedHemoglobinRecordUseCase'
import { GetSingleSleepRecordUseCase } from './application/record/GetSingleSleepRecordUseCase'
import { GetSingleWeightRecordUseCase } from './application/record/GetSingleWeightRecordUseCase'
import { GetExerciseRecordsUseCase } from './application/record/GetExerciseRecordsUseCase'
import { GetBloodPressureRecordsUseCase } from './application/record/GetBloodPressureRecordsUseCase'
import { GetBloodSugarRecordsUseCase } from './application/record/GetBloodSugarRecords'
import { GetFoodRecordsUseCase } from './application/record/GetFoodRecordsUseCase'
import { GetGlycatedHemoglobinRecordsUseCase } from './application/record/GetGlycatedHemoglobinRecordsUseCase'
import { GetSleepRecordsUseCase } from './application/record/GetSleepRecordsUseCase'
import { GetWeightRecordsUseCase } from './application/record/GetWeightRecordsUseCase'
import { CreateHealthGoalUseCase } from './application/goal/CreateHealthGoalUseCase'
import { HealthGoalController } from './infrastructure/http/controllers/HealthGoalController'
import { HealthGoalRoutes } from './infrastructure/http/routes/HealthGoalRoutes'
import { HealthGoalRepository } from './infrastructure/entities/goal/HealthGoalRepository'
import { ActivateHealthGoalUseCase } from './application/goal/ActivateHealthGoalUseCase'
import { RejectHealthGoalUseCase } from './application/goal/RejectHealthGoalUseCase'
import { GetHealthGoalUseCase } from './application/goal/GetHealthGoalUseCase'
import { GetDoctorStatisticUseCase } from './application/doctor/GetDoctorStatisticUseCase'
import { CreateMultipleTimeSlotsUseCase } from './application/consultation/CreateMultipleTimeSlotsUseCase'
import { GetPatientConsultAppointmentsUseCase } from './application/consultation/GetPatientConsultAppointmentsUseCase'
import { GetDoctorConsultAppointmentsUseCase } from './application/consultation/GetDoctorConsultAppointmentsUseCase'
import { NotificationRepository } from './infrastructure/entities/notification/NotificationRepository'
import { GetNotificationListUseCase } from './application/notification/GetNotificationListUseCase'
import { GetNotificationDetailsUseCase } from './application/notification/GetNotificationDetailsUseCase'
import { NotificationController } from './infrastructure/http/controllers/NotificationController'
import { NotificationRoutes } from './infrastructure/http/routes/NotificationRoutes'
import { GetNotificationHintsUseCase } from './application/notification/GetNotificationHintsUseCase'
import { ReadAllNotificationsUseCase } from './application/notification/ReadAllNotificationsUseCase'
import { DeleteAllNotificationsUseCase } from './application/notification/DeleteAllNotificationsUseCase'
import { DeleteNotificationUseCase } from './application/notification/DeleteNotificationUseCase'
import { NotificationHelper } from './application/notification/NotificationHelper'
import { GetHealthGoalListUseCase } from './application/goal/GetHealthGoalListUseCase'
import { HealthGoalCronJob } from './application/cronjob/HealthGoalCronJob'
import { Scheduler } from './infrastructure/network/Scheduler'
import { CancelHealthGoalUseCase } from './application/goal/CancelHealthGoalUseCase'
import { MeetingLinkRepository } from './infrastructure/entities/meeting/MeetingLinkRepository'
import { GetDoctorProfileUseCase } from './application/doctor/GetDoctorProfileUseCase'
import { GetPatientProfileUseCase } from './application/patient/GetPatientProfileUseCase'
import { GetDoctorListUseCase } from './application/doctor/GetDoctorListUseCase'
import { GetDoctorTimeSlotsUseCase } from './application/consultation/GetDoctorTimeSlotsUseCase'
import { EditUserAccountUseCase } from './application/user/EditUserAccountUseCase'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'
import { DeleteDoctorTimeSlotUseCase } from './application/consultation/DeleteDoctorTimeSlotUseCase'
import { GetAnswerDetailsUseCase } from './application/question/GetAnswerDetailsUseCase'
import { GetAnswerListUseCase } from './application/question/GetAnswerListUseCase'
import { AuthRoutes } from './infrastructure/http/routes/AuthRoutes'
import passport from 'passport'
import session from 'express-session'
import { UpdateGoalResultUseCase } from './application/goal/UpdateGoalResultUseCase'
import { GetGoalDurationRecordsUseCase } from './application/record/GetGoalDurationRecordsUseCase'
import SocketService from './infrastructure/network/SocketService'
import { UpdatePasswordUseCase } from './application/user/UpdatePasswordUseCase'
import { CreatePasswordChangeMailUseCase } from './application/user/CreatePasswordChangeMailUseCase'
import { GoogleMailService } from './infrastructure/network/GoogleMailService'
import { S3Client } from '@aws-sdk/client-s3'
import { EditUserAvatarUseCase } from './application/user/EditUserAvatarUseCase'
import { CommonController } from './infrastructure/http/controllers/CommonController'
import { GetDoctorsUseCase } from './application/common/GetDoctorsUseCase'
import { CommonRoutes } from './infrastructure/http/routes/CommonRoutes'
import { CreateDoctorUseCase } from './application/doctor/CreateDoctorUseCase'
import { CreatePatientUseCase } from './application/patient/CreatePatientUseCase'

void main()

async function main(): Promise<void> {
  dotenv.config()
  const env = process.env
  const port = env.API_PORT as string

  if (env.NODE_ENV === 'test' && env.POSTGRES_DB_NAME !== 'test_db') {
    throw new Error(
      `Running test on a non 'test' db will wipe out your entire db! POSTGRES_DB_NAME is specified as '${
        env.POSTGRES_DB_NAME as string
      }'`
    )
  }

  const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }

  const app: Express = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    path: '/ws/notification',
    transports: ['websocket'],
    cors: corsOptions,
  })

  const socketService = new SocketService(io)

  /**
   * Database Connection
   */
  const postgresDatabase = await PostgresDatabase.getInstance()
  const dataSource = postgresDatabase.getDataSource()

  /**
   * Shared Services
   */
  const uuidService = new UuidService()
  const hashGenerator = new BcryptHashGenerator()
  const scheduler = new Scheduler()
  const mailService = new GoogleMailService()

  /**
   * Repositories
   */
  const userRepository = new UserRepository(dataSource)
  const doctorRepository = new DoctorRepository(dataSource)
  const patientRepository = new PatientRepository(dataSource)
  const patientQuestionAnswerRepository = new PatientQuestionAnswerRepository(
    dataSource
  )
  const answerAgreementRepository = new AnswerAgreementRepository(dataSource)
  const patientQuestionRepository = new PatientQuestionRepository(dataSource)
  const answerAppreciationRepository = new AnswerAppreciationRepository(
    dataSource
  )
  const bloodPressureRecordRepository = new BloodPressureRecordRepository(
    dataSource
  )
  const bloodSugarRecordRepository = new BloodSugarRecordRepository(dataSource)
  const foodRecordRepository = new FoodRecordRepository(dataSource)
  const exerciseRecordRepository = new ExerciseRecordRepository(dataSource)
  const glycatedHemoglobinRecordRepository =
    new GlycatedHemoglobinRecordRepository(dataSource)
  const weightRecordRepository = new WeightRecordRepository(dataSource)
  const consultAppointmentRepository = new ConsultAppointmentRepository(
    dataSource
  )
  const doctorTimeSlotRepository = new DoctorTimeSlotRepository(dataSource)
  const healthGoalRepository = new HealthGoalRepository(dataSource)
  const notificationRepository = new NotificationRepository(dataSource)
  const meetingLinkRepository = new MeetingLinkRepository(dataSource)

  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.ACCESS_KEY as string,
      secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
    region: process.env.BUCKET_REGION as string,
  })

  /**
   * User Domain
   */
  const getUserAccountUseCase = new GetUserAccountUseCase(userRepository)
  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    uuidService,
    hashGenerator
  )
  const editUserAccountUseCase = new EditUserAccountUseCase(
    userRepository,
    hashGenerator
  )

  const createPasswordChangeMailUseCase = new CreatePasswordChangeMailUseCase(
    userRepository,
    mailService
  )

  const updatePasswordUseCase = new UpdatePasswordUseCase(
    userRepository,
    hashGenerator
  )

  const editUserAvatarUseCase = new EditUserAvatarUseCase(s3Client, uuidService)

  /**
   * Doctor Domain
   */
  const createDoctorUseCase = new CreateDoctorUseCase(
    doctorRepository,
    userRepository,
    uuidService
  )
  const editDoctorProfileUseCase = new EditDoctorProfileUseCase(
    doctorRepository
  )

  const getDoctorProfileUseCase = new GetDoctorProfileUseCase(doctorRepository)

  const getDoctorListUseCase = new GetDoctorListUseCase(doctorRepository)

  /**
   * Patient Domain
   */
  const createPatientUseCase = new CreatePatientUseCase(
    patientRepository,
    userRepository,
    uuidService
  )
  const editPatientProfileUseCase = new EditPatientProfileUseCase(
    patientRepository
  )
  const getPatientProfileUseCase = new GetPatientProfileUseCase(
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )

  /**
   * Cross domain helper
   */

  const notificationHelper = new NotificationHelper(
    notificationRepository,
    uuidService,
    socketService
  )

  /**
   * Question Domain
   */
  const createAnswerAgreementUseCase = new CreateAnswerAgreementUseCase(
    patientQuestionAnswerRepository,
    answerAgreementRepository,
    doctorRepository,
    uuidService,
    notificationHelper
  )
  const cancelAnswerAgreementUseCase = new CancelAnswerAgreementUseCase(
    answerAgreementRepository,
    doctorRepository,
    patientQuestionAnswerRepository,
    notificationHelper
  )

  const createAnswerAppreciationUseCase = new CreateAnswerAppreciationUseCase(
    patientQuestionAnswerRepository,
    patientRepository,
    answerAppreciationRepository,
    uuidService,
    notificationHelper,
    doctorRepository
  )
  const cancelAnswerAppreciationUseCase = new CancelAnswerAppreciationUseCase(
    answerAppreciationRepository,
    patientRepository,
    patientQuestionAnswerRepository,
    doctorRepository,
    notificationHelper
  )
  const createPatientQuestionAnswerUseCase =
    new CreatePatientQuestionAnswerUseCase(
      patientQuestionAnswerRepository,
      patientQuestionRepository,
      doctorRepository,
      uuidService,
      notificationHelper,
      patientRepository
    )

  const cancelPatientQuestionAnswerUseCase =
    new CancelPatientQuestionAnswerUseCase(
      patientQuestionAnswerRepository,
      answerAppreciationRepository,
      answerAgreementRepository,
      doctorRepository
    )

  const createPatientQuestionUseCase = new CreatePatientQuestionUseCase(
    patientQuestionRepository,
    patientRepository,
    uuidService
  )

  const cancelPatientQuestionUseCase = new CancelPatientQuestionUseCase(
    patientQuestionRepository,
    patientRepository,
    answerAppreciationRepository,
    answerAgreementRepository,
    patientQuestionAnswerRepository
  )
  const getSingleQuestionUseCase = new GetSingleQuestionUseCase(
    patientQuestionRepository,
    patientRepository,
    patientQuestionAnswerRepository,
    doctorRepository,
    answerAppreciationRepository
  )

  const getQuestionsUseCase = new GetQuestionsUseCase(patientQuestionRepository)

  const getAnswerDetailsUseCase = new GetAnswerDetailsUseCase(
    patientQuestionAnswerRepository,
    doctorRepository,
    answerAppreciationRepository,
    answerAgreementRepository
  )

  const getAnswerListUseCase = new GetAnswerListUseCase(
    patientQuestionAnswerRepository,
    doctorRepository
  )
  /**
   * Cross domain usecase
   */

  const getDoctorStatisticUseCase = new GetDoctorStatisticUseCase(
    patientQuestionAnswerRepository,
    doctorRepository
  )

  const getDoctorsUseCase = new GetDoctorsUseCase(doctorRepository)

  /**
   * Record Domain
   */
  const createBloodPressureRecordUseCase = new CreateBloodPressureRecordUseCase(
    bloodPressureRecordRepository,
    patientRepository,
    uuidService
  )
  const editBloodPressureRecordUseCase = new EditBloodPressureRecordUseCase(
    bloodPressureRecordRepository,
    patientRepository
  )
  const createBloodSugarRecordUseCase = new CreateBloodSugarRecordUseCase(
    bloodSugarRecordRepository,
    patientRepository,
    uuidService
  )
  const editBloodSugarRecordUseCase = new EditBloodSugarRecordUseCase(
    bloodSugarRecordRepository,
    patientRepository
  )
  const createFoodRecordUseCase = new CreateFoodRecordUseCase(
    foodRecordRepository,
    patientRepository,
    uuidService
  )
  const editFoodRecordUseCase = new EditFoodRecordUseCase(
    foodRecordRepository,
    patientRepository
  )
  const createExerciseRecordUseCase = new CreateExerciseRecordUseCase(
    exerciseRecordRepository,
    patientRepository,
    uuidService
  )
  const editExerciseRecordUseCase = new EditExerciseRecordUseCase(
    exerciseRecordRepository,
    patientRepository
  )
  const sleepRecordRepository = new SleepRecordRepository(dataSource)
  const createSleepRecordUseCase = new CreateSleepRecordUseCase(
    sleepRecordRepository,
    patientRepository,
    uuidService
  )
  const editSleepRecordUseCase = new EditSleepRecordUseCase(
    sleepRecordRepository,
    patientRepository
  )
  const createWeightRecordUseCase = new CreateWeightRecordUseCase(
    weightRecordRepository,
    patientRepository,
    uuidService
  )
  const editWeightRecordUseCase = new EditWeightRecordUseCase(
    weightRecordRepository,
    patientRepository
  )
  const createGlycatedHemoglobinRecordUseCase =
    new CreateGlycatedHemoglobinRecordUseCase(
      glycatedHemoglobinRecordRepository,
      patientRepository,
      uuidService
    )
  const editGlycatedHemoglobinRecordUseCase =
    new EditGlycatedHemoglobinRecordUseCase(
      glycatedHemoglobinRecordRepository,
      patientRepository
    )
  const getSingleExerciseRecordUseCase = new GetSingleExerciseRecordUseCase(
    exerciseRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )
  const getSingleBloodPressureRecordUseCase =
    new GetSingleBloodPressureRecordUseCase(
      bloodPressureRecordRepository,
      patientRepository,
      doctorRepository,
      consultAppointmentRepository
    )
  const getSingleBloodSugarRecordUseCase = new GetSingleBloodSugarRecordUseCase(
    bloodSugarRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )
  const getSingleFoodRecordUseCase = new GetSingleFoodRecordUseCase(
    foodRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )
  const getSingleGlycatedHemoglobinRecordUseCase =
    new GetSingleGlycatedHemoglobinRecordUseCase(
      glycatedHemoglobinRecordRepository,
      patientRepository,
      doctorRepository,
      consultAppointmentRepository
    )
  const getSingleSleepRecordUseCase = new GetSingleSleepRecordUseCase(
    sleepRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )
  const getSingleWeightRecordUseCase = new GetSingleWeightRecordUseCase(
    weightRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )
  const getExerciseRecordsUseCase = new GetExerciseRecordsUseCase(
    exerciseRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )
  const getBloodPressureRecordsUseCase = new GetBloodPressureRecordsUseCase(
    bloodPressureRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )
  const getBloodSugarRecordsUseCase = new GetBloodSugarRecordsUseCase(
    bloodSugarRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )
  const getFoodRecordsUseCase = new GetFoodRecordsUseCase(
    foodRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )
  const getGlycatedHemoglobinRecordsUseCase =
    new GetGlycatedHemoglobinRecordsUseCase(
      glycatedHemoglobinRecordRepository,
      patientRepository,
      doctorRepository,
      consultAppointmentRepository
    )
  const getSleepRecordsUseCase = new GetSleepRecordsUseCase(
    sleepRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )
  const getWeightRecordsUseCase = new GetWeightRecordsUseCase(
    weightRecordRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )

  const getGoalDurationRecordsUseCase = new GetGoalDurationRecordsUseCase(
    bloodPressureRecordRepository,
    bloodSugarRecordRepository,
    glycatedHemoglobinRecordRepository,
    weightRecordRepository,
    patientRepository,
    doctorRepository,
    healthGoalRepository,
    consultAppointmentRepository
  )

  /**
   * Conultation Domain
   */
  const createConsultAppointmentUseCase = new CreateConsultAppointmentUseCase(
    consultAppointmentRepository,
    doctorTimeSlotRepository,
    patientRepository,
    doctorRepository,
    meetingLinkRepository,
    uuidService,
    notificationHelper,
    scheduler
  )
  const cancelConsultAppointmentUseCase = new CancelConsultAppointmentUseCase(
    consultAppointmentRepository,
    patientRepository,
    doctorRepository,
    meetingLinkRepository,
    notificationHelper,
    scheduler
  )

  const createDoctorTimeSlotUseCase = new CreateDoctorTimeSlotUseCase(
    doctorTimeSlotRepository,
    doctorRepository,
    uuidService
  )
  const editDoctorTimeSlotUseCase = new EditDoctorTimeSlotUseCase(
    doctorTimeSlotRepository,
    doctorRepository
  )
  const createMultipleTimeSlotsUseCase = new CreateMultipleTimeSlotsUseCase(
    doctorTimeSlotRepository,
    doctorRepository,
    uuidService
  )
  const getPatientConsultAppointmentsUseCase =
    new GetPatientConsultAppointmentsUseCase(
      consultAppointmentRepository,
      patientRepository
    )

  const getDoctorConsultAppointmentsUseCase =
    new GetDoctorConsultAppointmentsUseCase(
      consultAppointmentRepository,
      doctorRepository
    )

  const getDoctorTimeSlotsUseCase = new GetDoctorTimeSlotsUseCase(
    doctorTimeSlotRepository,
    doctorRepository
  )

  const deleteDoctorTimeSlotUseCase = new DeleteDoctorTimeSlotUseCase(
    doctorTimeSlotRepository,
    doctorRepository
  )

  /**
   * HealthGoal Domain
   */
  const createHealthGoalUseCase = new CreateHealthGoalUseCase(
    healthGoalRepository,
    patientRepository,
    bloodPressureRecordRepository,
    bloodSugarRecordRepository,
    glycatedHemoglobinRecordRepository,
    weightRecordRepository,
    uuidService,
    notificationHelper
  )

  const cancelHealthGoalUseCase = new CancelHealthGoalUseCase(
    patientRepository,
    healthGoalRepository,
    notificationHelper
  )

  const activateHealthGoalUseCase = new ActivateHealthGoalUseCase(
    healthGoalRepository,
    patientRepository
  )

  const rejectHealthGoalUseCase = new RejectHealthGoalUseCase(
    healthGoalRepository,
    patientRepository
  )

  const getHealthGoalUseCase = new GetHealthGoalUseCase(
    healthGoalRepository,
    patientRepository,
    doctorRepository,
    bloodPressureRecordRepository,
    bloodSugarRecordRepository,
    glycatedHemoglobinRecordRepository,
    weightRecordRepository,
    consultAppointmentRepository
  )

  const getHealthGoalListUseCase = new GetHealthGoalListUseCase(
    healthGoalRepository,
    patientRepository,
    doctorRepository,
    consultAppointmentRepository
  )

  const updateGoalResultUseCase = new UpdateGoalResultUseCase(
    healthGoalRepository,
    bloodPressureRecordRepository,
    bloodSugarRecordRepository,
    weightRecordRepository,
    glycatedHemoglobinRecordRepository
  )

  /**
   * Notification Domain
   */

  const getNotificationListUseCase = new GetNotificationListUseCase(
    notificationRepository
  )

  const getNotificationDetailsUseCase = new GetNotificationDetailsUseCase(
    notificationRepository
  )

  const getNotificationHintsUseCase = new GetNotificationHintsUseCase(
    notificationRepository
  )

  const readAllNotificationsUseCase = new ReadAllNotificationsUseCase(
    notificationRepository
  )

  const deleteAllNotificationsUseCase = new DeleteAllNotificationsUseCase(
    notificationRepository
  )

  const deleteNotificationUseCase = new DeleteNotificationUseCase(
    notificationRepository
  )

  /**
   * Cron Job
   */
  const healthGoalCronJob = new HealthGoalCronJob(
    scheduler,
    createHealthGoalUseCase,
    cancelHealthGoalUseCase,
    updateGoalResultUseCase,
    userRepository,
    healthGoalRepository
  )
  await healthGoalCronJob.init()
  /**
   * Controllers
   */
  const userController = new UserController(
    getUserAccountUseCase,
    createUserUseCase,
    patientRepository,
    doctorRepository,
    editUserAccountUseCase,
    createPasswordChangeMailUseCase,
    updatePasswordUseCase,
    editUserAvatarUseCase,
    createDoctorUseCase,
    createPatientUseCase
  )

  const patientController = new PatientController(
    editPatientProfileUseCase,
    getPatientProfileUseCase
  )
  const doctorController = new DoctorController(
    editDoctorProfileUseCase,
    getDoctorProfileUseCase,
    getDoctorStatisticUseCase,
    getDoctorListUseCase
  )
  const recordController = new RecordController(
    createWeightRecordUseCase,
    editWeightRecordUseCase,
    createBloodPressureRecordUseCase,
    editBloodPressureRecordUseCase,
    createBloodSugarRecordUseCase,
    editBloodSugarRecordUseCase,
    createExerciseRecordUseCase,
    editExerciseRecordUseCase,
    createFoodRecordUseCase,
    editFoodRecordUseCase,
    createGlycatedHemoglobinRecordUseCase,
    editGlycatedHemoglobinRecordUseCase,
    createSleepRecordUseCase,
    editSleepRecordUseCase,
    getSingleExerciseRecordUseCase,
    getSingleBloodPressureRecordUseCase,
    getSingleBloodSugarRecordUseCase,
    getSingleFoodRecordUseCase,
    getSingleGlycatedHemoglobinRecordUseCase,
    getSingleSleepRecordUseCase,
    getSingleWeightRecordUseCase,
    getExerciseRecordsUseCase,
    getBloodPressureRecordsUseCase,
    getBloodSugarRecordsUseCase,
    getFoodRecordsUseCase,
    getGlycatedHemoglobinRecordsUseCase,
    getSleepRecordsUseCase,
    getWeightRecordsUseCase,
    getGoalDurationRecordsUseCase
  )
  const questionController = new QuestionController(
    createAnswerAgreementUseCase,
    createAnswerAppreciationUseCase,
    createPatientQuestionAnswerUseCase,
    cancelPatientQuestionAnswerUseCase,
    createPatientQuestionUseCase,
    cancelAnswerAppreciationUseCase,
    cancelAnswerAgreementUseCase,
    cancelPatientQuestionUseCase,
    getSingleQuestionUseCase,
    getQuestionsUseCase,
    getAnswerDetailsUseCase,
    getAnswerListUseCase
  )

  const consultationController = new ConsultationController(
    createConsultAppointmentUseCase,
    cancelConsultAppointmentUseCase,
    createDoctorTimeSlotUseCase,
    editDoctorTimeSlotUseCase,
    createMultipleTimeSlotsUseCase,
    getPatientConsultAppointmentsUseCase,
    getDoctorConsultAppointmentsUseCase,
    getDoctorTimeSlotsUseCase,
    deleteDoctorTimeSlotUseCase
  )

  const healthGoalController = new HealthGoalController(
    createHealthGoalUseCase,
    cancelHealthGoalUseCase,
    activateHealthGoalUseCase,
    rejectHealthGoalUseCase,
    getHealthGoalUseCase,
    getHealthGoalListUseCase,
    updateGoalResultUseCase
  )

  const notificationController = new NotificationController(
    getNotificationListUseCase,
    getNotificationDetailsUseCase,
    getNotificationHintsUseCase,
    readAllNotificationsUseCase,
    deleteAllNotificationsUseCase,
    deleteNotificationUseCase
  )

  const commonController = new CommonController(getDoctorsUseCase)

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(
    session({
      secret: 'ThisIsMySecret',
      resave: false,
      saveUninitialized: true,
    })
  )
  // eslint-disable-next-line no-new
  new PassportConfig(userRepository, uuidService)
  // app.use(passport.initialize())
  app.use(passport.session())

  /**
   * Routes
   */
  const authRoutes = new AuthRoutes(userController)
  const userRoutes = new UserRoutes(userController)
  const patientRoutes = new PatientRoutes(patientController)
  const recordRoutes = new RecordRoutes(recordController)
  const doctorRoutes = new DoctorRoutes(doctorController)
  const questionRoutes = new QuestionRoutes(questionController)
  const consultationRoutes = new ConsultationRoutes(consultationController)
  const healthGoalRoutes = new HealthGoalRoutes(healthGoalController)
  const notificationRoutes = new NotificationRoutes(notificationController)
  const commonRoutes = new CommonRoutes(commonController)

  const mainRoutes = new MainRoutes(
    commonRoutes,
    authRoutes,
    userRoutes,
    patientRoutes,
    recordRoutes,
    doctorRoutes,
    questionRoutes,
    consultationRoutes,
    healthGoalRoutes,
    notificationRoutes
  )

  app.use(cors(corsOptions))
  app.use('/upload', express.static(path.join(__dirname, 'upload')))
  app.use('/api', mainRoutes.createRouter())
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  app.use(errorHandler)

  httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}
