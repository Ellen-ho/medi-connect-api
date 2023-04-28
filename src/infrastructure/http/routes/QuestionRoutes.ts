import { Router } from 'express'
import { IQuestionController } from '../controllers/QuestionController'
import { asyncHandler } from '../middlewares/AsyncHandler'

export class QuestionRoutes {
  private readonly routes: Router
  constructor(private readonly questionController: IQuestionController) {
    this.routes = Router()
    this.routes
      .post('/', asyncHandler(this.questionController.createPatientQuestion))
      .patch('/:id', asyncHandler(this.questionController.editPatientQuestion))
      .delete(
        '/:id',
        asyncHandler(this.questionController.cancelPatientQuestion)
      )

      .post(
        '/:id/anwsers',
        asyncHandler(this.questionController.createPatientQuestionAnswer)
      )
      .patch(
        '/answers/:id',
        asyncHandler(this.questionController.editPatientQuestionAnswerContent)
      )
      .delete(
        '/answers/:id',
        asyncHandler(this.questionController.cancelPatientQuestionAnswer)
      )

      .post(
        '/answers/:id/agreements',
        asyncHandler(this.questionController.createAnswerAgreement)
      )
      .patch(
        '/answers/agreements/:id',
        asyncHandler(this.questionController.editAnswerAgreementComment)
      )
      .delete(
        '/answers/agreements/:id',
        asyncHandler(this.questionController.cancelAnswerAgreement)
      )

      .post(
        '/answerAppreciation',
        asyncHandler(this.questionController.createAnswerAppreciation)
      )
      .patch(
        '/answers/appreciations/:id',
        asyncHandler(this.questionController.editAnswerAppreciationContent)
      )
      .delete(
        '/answers/appreciations/:id',
        asyncHandler(this.questionController.cancelAnswerAppreciation)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
