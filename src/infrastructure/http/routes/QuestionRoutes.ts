import { Router } from 'express'
import { IQuestionController } from '../controllers/QuestionController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  cancelAnswerAgreementSchema,
  cancelPatientQuestionAnswerSchema,
  cancelPatientQuestionSchema,
  creatPatientQuestionAnswerSchema,
  creatPatientQuestionSchema,
  createAnswerAgreementSchema,
  editAnswerAgreementCommentSchema,
  editPatientQuestionSchema,
  getSingleQuestionSchema,
} from '../../../application/question/QuestionValidator'
import { validator } from '../middlewares/Validator'

export class QuestionRoutes {
  private readonly routes: Router
  constructor(private readonly questionController: IQuestionController) {
    this.routes = Router()
    this.routes
      // patient specific
      .patch(
        '/answers/appreciations/:id',
        validator(editAnswerAgreementCommentSchema),
        asyncHandler(this.questionController.editAnswerAppreciationContent)
      )
      .patch(
        '/answers/agreements/:id',
        validator(editAnswerAgreementCommentSchema),
        asyncHandler(this.questionController.editAnswerAgreementComment)
      )
      .patch(
        '/:id',
        validator(editPatientQuestionSchema),
        asyncHandler(this.questionController.editPatientQuestion)
      )
      .delete(
        '/answers/appreciations/:id',
        validator(cancelAnswerAgreementSchema),
        asyncHandler(this.questionController.cancelAnswerAppreciation)
      )
      .delete(
        '/answers/agreements/:id',
        validator(cancelAnswerAgreementSchema),
        asyncHandler(this.questionController.cancelAnswerAgreement)
      )
      .delete(
        '/answers/:id',
        validator(cancelPatientQuestionAnswerSchema),
        asyncHandler(this.questionController.cancelPatientQuestionAnswer)
      )
      .delete(
        '/:id',
        validator(cancelPatientQuestionSchema),
        asyncHandler(this.questionController.cancelPatientQuestion)
      )
      .post(
        '/answers/:id/appreciations',
        validator(createAnswerAgreementSchema),
        asyncHandler(this.questionController.createAnswerAppreciation)
      )
      .post(
        '/answers/:id/agreements',
        validator(createAnswerAgreementSchema),
        asyncHandler(this.questionController.createAnswerAgreement)
      )
      .post(
        '/:id/answers',
        validator(creatPatientQuestionAnswerSchema),
        asyncHandler(this.questionController.createPatientQuestionAnswer)
      )
      // TODO: uncomment when edit is needed
      // .patch(
      //   '/answers/:id',
      //   validator(editPatientQuestionAnswerSchema),
      //   asyncHandler(this.questionController.editPatientQuestionAnswerContent)
      // )
      .post(
        '/',
        validator(creatPatientQuestionSchema),
        asyncHandler(this.questionController.createPatientQuestion)
      )
      .get(
        '/:id',
        validator(getSingleQuestionSchema),
        asyncHandler(this.questionController.getSingleQuestion)
      )
      .get('/', asyncHandler(this.questionController.getQuestions))
  }

  public createRouter(): Router {
    return this.routes
  }
}
