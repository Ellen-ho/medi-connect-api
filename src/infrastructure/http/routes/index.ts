import { Router } from 'express'
import { PatientRoutes } from './PatientRoutes'
import { UserRoutes } from './UserRoutes'
import { RecordRoutes } from './RecordRoutes'
import { DoctorRoutes } from './DoctorRoutes'
import { QuestionRoutes } from './QuestionRoutes'
import { ConsultationRoutes } from './ConsultationRoutes'
import { HealthGoalRoutes } from './HealthGoalRoutes'
import { NotificationRoutes } from './NotificationRoutes'
import { AuthRoutes } from './AuthRoutes'
import { CommonRoutes } from './CommonRoutes'

export class MainRoutes {
  private readonly routes: Router
  constructor(
    private readonly commonRoutes: CommonRoutes,
    private readonly authRoutes: AuthRoutes,
    private readonly userRoutes: UserRoutes,
    private readonly patientRoutes: PatientRoutes,
    private readonly recordRoutes: RecordRoutes,
    private readonly doctorRoutes: DoctorRoutes,
    private readonly questionRoutes: QuestionRoutes,
    private readonly consultationRoutes: ConsultationRoutes,
    private readonly healthGoalRoutes: HealthGoalRoutes,
    private readonly notificationRoutes: NotificationRoutes
  ) {
    this.routes = Router()
    this.routes.use('/commons', this.commonRoutes.createRouter())
    this.routes.use('/auth', this.authRoutes.createRouter())
    this.routes.use('/users', this.userRoutes.createRouter())
    this.routes.use('/patients', this.patientRoutes.createRouter())
    this.routes.use('/records', this.recordRoutes.createRouter())
    this.routes.use('/doctors', this.doctorRoutes.createRouter())
    this.routes.use('/questions', this.questionRoutes.createRouter())
    this.routes.use('/consultations', this.consultationRoutes.createRouter())
    this.routes.use('/health-goals', this.healthGoalRoutes.createRouter())
    this.routes.use('/notifications', this.notificationRoutes.createRouter())
  }

  public createRouter(): Router {
    return this.routes
  }
}
