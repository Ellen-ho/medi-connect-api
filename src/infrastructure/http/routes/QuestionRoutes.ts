import { Router } from 'express'
import { IQuestionController } from '../controllers/QuestionController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import {
  cancelAnswerAgreementSchema,
  cancelPatientQuestionAnswerSchema,
  cancelPatientQuestionSchema,
  creatAnswerAppreciationSchema,
  creatPatientQuestionAnswerSchema,
  creatPatientQuestionSchema,
  createAnswerAgreementSchema,
  getAnswerDetailsSchema,
  getAnswerListSchema,
  getQuestonsSchema,
  getSingleQuestionSchema,
} from '../../../application/question/QuestionValidator'
import { validator } from '../middlewares/Validator'
import { authenticated } from '../middlewares/Auth'

export class QuestionRoutes {
  private readonly routes: Router
  constructor(private readonly questionController: IQuestionController) {
    this.routes = Router()
    this.routes
      .delete(
        '/answers/:id/appreciations',
        authenticated,
        validator(cancelAnswerAgreementSchema),
        asyncHandler(this.questionController.cancelAnswerAppreciation)
      )
      .delete(
        '/answers/:id/agreements',
        authenticated,
        validator(cancelAnswerAgreementSchema),
        asyncHandler(this.questionController.cancelAnswerAgreement)
      )
      .delete(
        '/answers/:id',
        authenticated,
        validator(cancelPatientQuestionAnswerSchema),
        asyncHandler(this.questionController.cancelPatientQuestionAnswer)
      )
      .delete(
        '/:id',
        authenticated,
        validator(cancelPatientQuestionSchema),
        asyncHandler(this.questionController.cancelPatientQuestion)
      )
      .post(
        '/answers/:id/appreciations',
        authenticated,
        validator(creatAnswerAppreciationSchema),
        asyncHandler(this.questionController.createAnswerAppreciation)
      )
      .post(
        '/answers/:id/agreements',
        authenticated,
        validator(createAnswerAgreementSchema),
        asyncHandler(this.questionController.createAnswerAgreement)
      )
      .post(
        '/:id/answers',
        authenticated,
        validator(creatPatientQuestionAnswerSchema),
        asyncHandler(this.questionController.createPatientQuestionAnswer)
      )
      .post(
        '/',
        authenticated,
        validator(creatPatientQuestionSchema),
        asyncHandler(this.questionController.createPatientQuestion)
      )
      .get(
        '/answers/:id',
        authenticated,
        validator(getAnswerDetailsSchema),
        asyncHandler(this.questionController.getAnswerDetails)
      )
      .get(
        '/answers',
        authenticated,
        validator(getAnswerListSchema),
        asyncHandler(this.questionController.getAnswerList)
      )
      .get(
        '/:id',
        authenticated,
        validator(getSingleQuestionSchema),
        asyncHandler(this.questionController.getSingleQuestion)
      )
      .get(
        '/',
        authenticated,
        validator(getQuestonsSchema),
        asyncHandler(this.questionController.getQuestions)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
