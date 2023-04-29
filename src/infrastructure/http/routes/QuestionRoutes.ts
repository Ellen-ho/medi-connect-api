import { Router } from 'express'
import { IQuestionController } from '../controllers/QuestionController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { authenticated } from '../middlewares/Auth'
import {
  cancelAnswerAgreementSchema,
  cancelPatientQuestionAnswerSchema,
  cancelPatientQuestionSchema,
  creatPatientQuestionAnswerSchema,
  creatPatientQuestionSchema,
  createAnswerAgreementSchema,
  editAnswerAgreementCommentSchema,
  editPatientQuestionAnswerSchema,
  editPatientQuestionSchema,
} from '../../../application/question/QuestionValidator'
import { validator } from '../middlewares/Validator'

export class QuestionRoutes {
  private readonly routes: Router
  constructor(private readonly questionController: IQuestionController) {
    this.routes = Router()
    this.routes
      .post(
        '/',
        authenticated,
        validator(creatPatientQuestionSchema),
        asyncHandler(this.questionController.createPatientQuestion)
      )
      .patch(
        '/:id',
        authenticated,
        validator(editPatientQuestionSchema),
        asyncHandler(this.questionController.editPatientQuestion)
      )
      .delete(
        '/:id',
        authenticated,
        validator(cancelPatientQuestionSchema),
        asyncHandler(this.questionController.cancelPatientQuestion)
      )

      .post(
        '/:id/anwsers',
        authenticated,
        validator(creatPatientQuestionAnswerSchema),
        asyncHandler(this.questionController.createPatientQuestionAnswer)
      )
      .patch(
        '/answers/:id',
        authenticated,
        validator(editPatientQuestionAnswerSchema),
        asyncHandler(this.questionController.editPatientQuestionAnswerContent)
      )
      .delete(
        '/answers/:id',
        authenticated,
        validator(cancelPatientQuestionAnswerSchema),
        asyncHandler(this.questionController.cancelPatientQuestionAnswer)
      )

      .post(
        '/answers/:id/agreements',
        authenticated,
        validator(createAnswerAgreementSchema),
        asyncHandler(this.questionController.createAnswerAgreement)
      )
      .patch(
        '/answers/agreements/:id',
        authenticated,
        validator(editAnswerAgreementCommentSchema),
        asyncHandler(this.questionController.editAnswerAgreementComment)
      )
      .delete(
        '/answers/agreements/:id',
        authenticated,
        validator(cancelAnswerAgreementSchema),
        asyncHandler(this.questionController.cancelAnswerAgreement)
      )

      .post(
        '/answerAppreciation',
        authenticated,
        validator(createAnswerAgreementSchema),
        asyncHandler(this.questionController.createAnswerAppreciation)
      )
      .patch(
        '/answers/appreciations/:id',
        authenticated,
        validator(editAnswerAgreementCommentSchema),
        asyncHandler(this.questionController.editAnswerAppreciationContent)
      )
      .delete(
        '/answers/appreciations/:id',
        authenticated,
        validator(cancelAnswerAgreementSchema),
        asyncHandler(this.questionController.cancelAnswerAppreciation)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
