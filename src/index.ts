import 'reflect-metadata'
import express, { Express } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { PostgresDatabase } from './infrastructure/database/PostgresDatabase'
import { UuidService } from './infrastructure/utils/UuidService'
import { UserRepository } from './infrastructure/entities/user/UserRepository'
import { GetUserUseCase } from './application/user/GetUserUseCase'
import { CreateUserUseCase } from './application/user/CreateUserUseCase'
import { UserController } from './infrastructure/http/controllers/UserController'
import { UserRoutes } from './infrastructure/http/routes/UserRoutes'
import { MainRoutes } from './infrastructure/http/routes'
import { errorHandler } from './infrastructure/http/middlewares/ErrorHandler'
import { BcryptHashGenerator } from './infrastructure/utils/BcryptHashGenerator'
import { PassportConfig } from './infrastructure/config/passportConfig'
import { PatientRoutes } from './infrastructure/http/routes/PatientRoutes'
import { PatientController } from './infrastructure/http/controllers/PatientController'
import { CreatePatientProfileUseCase } from './application/patient/CreatePatientProfileUseCase'
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
import { CreateDoctorProfileUseCase } from './application/doctor/CreateDoctorProfileUseCase'
import { EditDoctorProfileUseCase } from './application/doctor/EditDoctorProfileUseCase'
import { DoctorRepository } from './infrastructure/entities/doctor/DoctorRepository'
import { QuestionRoutes } from './infrastructure/http/routes/QuestionRoutes'
import { QuestionController } from './infrastructure/http/controllers/QuestionController'
import { CreateAnswerAgreementUseCase } from './application/question/CreateAnswerAgreementUseCase'
import { EditAnswerAgreementCommentUseCase } from './application/question/EditAnswerAgreementCommentUseCase'
import { AnswerAgreementRepository } from './infrastructure/entities/question/AnswerAgreementRepository'
import { CancelAnswerAgreementUseCase } from './application/question/CancelAnswerAgreementUseCase'
import { AnswerAppreciationRepository } from './infrastructure/entities/question/AnswerAppreciationRepository'
import { CreateAnswerAppreciationUseCase } from './application/question/CreateAnswerAppreciationUseCase'
import { EditAnswerAppreciationContentUseCase } from './application/question/EditAnswerAppreciationContentUseCase'
import { CancelAnswerAppreciationUseCase } from './application/question/CancelAnswerAppreciationUseCase'
import { PatientQuestionAnswerRepository } from './infrastructure/entities/question/PatientQuestionAnswerRepository'
import { CreatePatientQuestionAnswerUseCase } from './application/question/CreatePatientQuestionAnswerUseCase'
import { EditPatientQuestionAnswerContentUseCase } from './application/question/EditPatientQuestionAnswerContentUseCase'
import { CancelPatientQuestionAnswerUseCase } from './application/question/CancelPatientQuestionAnswerUseCase'
import { EditPatientQuestionUseCase } from './application/question/EditPatientQuestionUseCase'
import { CreatePatientQuestionUseCase } from './application/question/CreatePatientQuestionUseCase'
import { PatientQuestionRepository } from './infrastructure/entities/question/PatientQuestionRepository'
import { CancelPatientQuestionUseCase } from './application/question/CancelPatientQuestionUsecase'
import { RepositoryTx } from './infrastructure/database/RepositoryTx'
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
// import { RawQueryRepository } from './infrastructure/database/RawRepository'

void main()

async function main(): Promise<void> {
  // TODO: should active only on dev environment
  dotenv.config()
  const env = process.env
  const port = env.API_PORT as string

  /**
   * Database Connection
   */
  const postgresDatabase = new PostgresDatabase()
  await postgresDatabase.connect()
  const dataSource = postgresDatabase.getDataSource()

  /**
   * Shared Services
   */
  // const rawQueryRepository = new RawQueryRepository(dataSource)
  const uuidService = new UuidService()
  const hashGenerator = new BcryptHashGenerator()
  const scheduler = new Scheduler()

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

  /**
   * User Domain
   */
  const getUserUseCase = new GetUserUseCase(userRepository)
  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    uuidService,
    hashGenerator
  )

  /**
   * Doctor Domain
   */
  const createDoctorProfileUseCase = new CreateDoctorProfileUseCase(
    doctorRepository,
    uuidService
  )
  const editDoctorProfileUseCase = new EditDoctorProfileUseCase(
    doctorRepository
  )

  /**
   * Patient Domain
   */
  const createPatientProfileUseCase = new CreatePatientProfileUseCase(
    patientRepository,
    uuidService
  )
  const editPatientProfileUseCase = new EditPatientProfileUseCase(
    patientRepository
  )

  /**
   * Cross domain helper
   */

  const notificationHelper = new NotificationHelper(
    notificationRepository,
    uuidService
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
  const editAnswerAgreementCommentUseCase =
    new EditAnswerAgreementCommentUseCase(
      answerAgreementRepository,
      doctorRepository
    )
  const cancelAnswerAgreementUseCase = new CancelAnswerAgreementUseCase(
    answerAgreementRepository,
    doctorRepository
  )

  const createAnswerAppreciationUseCase = new CreateAnswerAppreciationUseCase(
    patientQuestionAnswerRepository,
    patientRepository,
    answerAppreciationRepository,
    uuidService,
    notificationHelper,
    doctorRepository
  )
  const editAnswerAppreciationContentUseCase =
    new EditAnswerAppreciationContentUseCase(
      answerAppreciationRepository,
      patientRepository
    )
  const cancelAnswerAppreciationUseCase = new CancelAnswerAppreciationUseCase(
    answerAppreciationRepository,
    patientRepository
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
  const editPatientQuestionAnswerContentUseCase =
    new EditPatientQuestionAnswerContentUseCase(
      patientQuestionAnswerRepository,
      doctorRepository
    )
  const cancelPatientQuestionAnswerUseCase =
    new CancelPatientQuestionAnswerUseCase(
      patientQuestionAnswerRepository,
      answerAppreciationRepository,
      answerAgreementRepository,
      doctorRepository,
      new RepositoryTx(dataSource)
    )

  const createPatientQuestionUseCase = new CreatePatientQuestionUseCase(
    patientQuestionRepository,
    patientRepository,
    uuidService
  )
  const editPatientQuestionUseCase = new EditPatientQuestionUseCase(
    patientQuestionRepository,
    patientRepository
  )
  const cancelPatientQuestionUseCase = new CancelPatientQuestionUseCase(
    patientQuestionRepository,
    patientRepository,
    answerAppreciationRepository,
    answerAgreementRepository,
    patientQuestionAnswerRepository,
    new RepositoryTx(dataSource)
  )
  const getSingleQuestionUseCase = new GetSingleQuestionUseCase(
    patientQuestionRepository,
    patientRepository,
    patientQuestionAnswerRepository
  )

  const getQuestionsUseCase = new GetQuestionsUseCase(patientQuestionRepository)

  /**
   * Cross domain usecase
   */

  const getDoctorStatisticUseCase = new GetDoctorStatisticUseCase(
    patientQuestionAnswerRepository,
    doctorRepository
  )

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
    new RepositoryTx(dataSource),
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
    userRepository
  )
  await healthGoalCronJob.init()
  /**
   * Controllers
   */
  const userController = new UserController(getUserUseCase, createUserUseCase)
  const patientController = new PatientController(
    createPatientProfileUseCase,
    editPatientProfileUseCase
  )
  const doctorController = new DoctorController(
    createDoctorProfileUseCase,
    editDoctorProfileUseCase,
    getDoctorStatisticUseCase
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
    getWeightRecordsUseCase
  )
  const questionController = new QuestionController(
    createAnswerAgreementUseCase,
    editAnswerAgreementCommentUseCase,
    createAnswerAppreciationUseCase,
    editAnswerAppreciationContentUseCase,
    createPatientQuestionAnswerUseCase,
    editPatientQuestionAnswerContentUseCase,
    cancelPatientQuestionAnswerUseCase,
    createPatientQuestionUseCase,
    editPatientQuestionUseCase,
    cancelAnswerAppreciationUseCase,
    cancelAnswerAgreementUseCase,
    cancelPatientQuestionUseCase,
    getSingleQuestionUseCase,
    getQuestionsUseCase
  )

  const consultationController = new ConsultationController(
    createConsultAppointmentUseCase,
    cancelConsultAppointmentUseCase,
    createDoctorTimeSlotUseCase,
    editDoctorTimeSlotUseCase,
    createMultipleTimeSlotsUseCase,
    getPatientConsultAppointmentsUseCase,
    getDoctorConsultAppointmentsUseCase
  )

  const healthGoalController = new HealthGoalController(
    createHealthGoalUseCase,
    cancelHealthGoalUseCase,
    activateHealthGoalUseCase,
    rejectHealthGoalUseCase,
    getHealthGoalUseCase,
    getHealthGoalListUseCase
  )

  const notificationController = new NotificationController(
    getNotificationListUseCase,
    getNotificationDetailsUseCase,
    getNotificationHintsUseCase,
    readAllNotificationsUseCase,
    deleteAllNotificationsUseCase,
    deleteNotificationUseCase
  )

  const app: Express = express()
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  // eslint-disable-next-line no-new
  new PassportConfig(userRepository, uuidService)

  /**
   * Routes
   */
  const userRoutes = new UserRoutes(userController)
  const patientRoutes = new PatientRoutes(patientController)
  const recordRoutes = new RecordRoutes(recordController)
  const doctorRoutes = new DoctorRoutes(doctorController)
  const questionRoutes = new QuestionRoutes(questionController)
  const consultationRoutes = new ConsultationRoutes(consultationController)
  const healthGoalRoutes = new HealthGoalRoutes(healthGoalController)
  const notificationRoutes = new NotificationRoutes(notificationController)

  const mainRoutes = new MainRoutes(
    userRoutes,
    patientRoutes,
    recordRoutes,
    doctorRoutes,
    questionRoutes,
    consultationRoutes,
    healthGoalRoutes,
    notificationRoutes
  )
  const corsOptions = {
    origin: process.env.CORS_ORIGIN,
  }
  app.use(cors(corsOptions))
  app.use('/api', mainRoutes.createRouter())

  app.use(errorHandler)

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}
