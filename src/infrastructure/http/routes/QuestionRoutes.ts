import { Router } from 'express'
import { IQuestionController } from '../controllers/QuestionController'
import { asyncHandler } from '../middlewares/AsyncHandler'

export class QuestionRoutes {
  private readonly routes: Router
  constructor(private readonly questionController: IQuestionController) {
    this.routes = Router()
    this.routes
      .post(
        '/patientQuestion',
        asyncHandler(this.questionController.createPatientQuestion)
      )
      .patch(
        '/patientQuestion/:id',
        asyncHandler(this.questionController.editPatientQuestion)
      )
      .post(
        '/patientQuestionAnswer',
        asyncHandler(this.questionController.createPatientQuestionAnswer)
      )
      .patch(
        '/patientQuestionAnswer/:id',
        asyncHandler(this.questionController.editPatientQuestionAnswer)
      )
      .post(
        '/answerAgreement',
        asyncHandler(this.questionController.createAnswerAgreement)
      )
      .patch(
        '/answerAgreement/:id',
        asyncHandler(this.questionController.editAnswerAgreementComment)
      )

      .post(
        '/answerAppreciation',
        asyncHandler(this.questionController.createAnswerAppreciation)
      )
      .patch(
        '/exercise/:id',
        asyncHandler(this.questionController.editExerciseRecord)
      )

      .post('/food', asyncHandler(this.questionController.createFoodRecord))
      .patch('/food/:id', asyncHandler(this.questionController.editFoodRecord))

      .post(
        '/glycated-hemoglobin',
        asyncHandler(this.questionController.createGlycatedHemoglobinRecord)
      )
      .patch(
        '/glycated-hemoglobin/:id',
        asyncHandler(this.questionController.editGlycatedHemoglobinRecord)
      )

      .post('/sleep', asyncHandler(this.questionController.createSleepRecord))
      .patch(
        '/sleep/:id',
        asyncHandler(this.questionController.editSleepRecord)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
