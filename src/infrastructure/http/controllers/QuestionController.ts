import { Request, Response } from 'express'
import { CreateAnswerAgreementUseCase } from '../../../application/question/CreateAnswerAgreementUseCase'
import { CreateAnswerAppreciationUseCase } from '../../../application/question/CreateAnswerAppreciationUseCase'
import { CreatePatientQuestionAnswerUseCase } from '../../../application/question/CreatePatientQuestionAnswerUseCase'
import { CreatePatientQuestionUseCase } from '../../../application/question/CreatePatientQuestionUseCase'
import { EditAnswerAppreciationContentUseCase } from '../../../application/question/EditAnswerAppreciationContentUseCase'
import { EditAnswerAgreementCommentUseCase } from '../../../application/question/EditAnswerAgreementCommentUseCase'
import { EditPatientQuestionAnswerContentUseCase } from '../../../application/question/EditPatientQuestionAnswerContentUseCase'
import { EditPatientQuestionUseCase } from '../../../application/question/EditPatientQuestionUseCase'
import { CancelAnswerAppreciationUseCase } from '../../../application/question/CancelAnswerAppreciationUseCase'
import { CancelAnswerAgreementUseCase } from '../../../application/question/CancelAnswerAgreementUseCase'
import { CancelPatientQuestionAnswerUseCase } from '../../../application/question/CancelPatientQuestionAnswerUseCase'
import { CancelPatientQuestionUseCase } from '../../../application/question/CancelPatientQuestionUsecase'
import { User } from '../../../domain/user/User'
import { GetSingleQuestionUseCase } from '../../../application/question/GetSingleQuestionUseCase'
import { GetQuestionsUseCase } from '../../../application/question/GetQuestionsUsecase'

export interface IQuestionController {
  createAnswerAgreement: (req: Request, res: Response) => Promise<Response>
  editAnswerAgreementComment: (req: Request, res: Response) => Promise<Response>
  createAnswerAppreciation: (req: Request, res: Response) => Promise<Response>
  editAnswerAppreciationContent: (
    req: Request,
    res: Response
  ) => Promise<Response>
  createPatientQuestionAnswer: (
    req: Request,
    res: Response
  ) => Promise<Response>
  editPatientQuestionAnswerContent: (
    req: Request,
    res: Response
  ) => Promise<Response>
  createPatientQuestion: (req: Request, res: Response) => Promise<Response>
  editPatientQuestion: (req: Request, res: Response) => Promise<Response>
  cancelAnswerAgreement: (req: Request, res: Response) => Promise<Response>
  cancelAnswerAppreciation: (req: Request, res: Response) => Promise<Response>
  cancelPatientQuestionAnswer: (
    req: Request,
    res: Response
  ) => Promise<Response>
  cancelPatientQuestion: (req: Request, res: Response) => Promise<Response>
  getSingleQuestion: (req: Request, res: Response) => Promise<Response>
  getQuestions: (req: Request, res: Response) => Promise<Response>
}

export class QuestionController implements IQuestionController {
  constructor(
    private readonly createAnswerAgreementUseCase: CreateAnswerAgreementUseCase,
    private readonly editAnswerAgreementCommentUseCase: EditAnswerAgreementCommentUseCase,
    private readonly createAnswerAppreciationUseCase: CreateAnswerAppreciationUseCase,
    private readonly editAnswerAppreciationContentUseCase: EditAnswerAppreciationContentUseCase,
    private readonly createPatientQuestionAnswerUseCase: CreatePatientQuestionAnswerUseCase,
    private readonly editPatientQuestionAnswerContentUseCase: EditPatientQuestionAnswerContentUseCase,
    private readonly cancelPatientQuestionAnswerUseCase: CancelPatientQuestionAnswerUseCase,
    private readonly createPatientQuestionUseCase: CreatePatientQuestionUseCase,
    private readonly editPatientQuestionUseCase: EditPatientQuestionUseCase,
    private readonly cancelAnswerAppreciationUseCase: CancelAnswerAppreciationUseCase,
    private readonly cancelAnswerAgreementUseCase: CancelAnswerAgreementUseCase,
    private readonly cancelPatientQuestionUseCase: CancelPatientQuestionUseCase,
    private readonly getSingleQuestionUseCase: GetSingleQuestionUseCase,
    private readonly getQuestionsUseCase: GetQuestionsUseCase
  ) {}

  public createAnswerAgreement = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      comment: req.body.comment,
      user: req.user as User,
      answerId: req.params.id,
    }
    const result = await this.createAnswerAgreementUseCase.execute(request)
    return res.status(200).json(result)
  }

  public editAnswerAgreementComment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      comment: req.body.comment,
      user: req.user as User,
      answerAgreementId: req.params.id,
    }
    const result = await this.editAnswerAgreementCommentUseCase.execute(request)
    return res.status(200).json(result)
  }

  public createAnswerAppreciation = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { ...req.body, user: req.user }
    const result = await this.createAnswerAppreciationUseCase.execute(request)
    return res.status(200).json(result)
  }

  public editAnswerAppreciationContent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      content: req.body.content,
      user: req.user as User,
      answerAppreciationId: req.params.id,
    }
    const result = await this.editAnswerAppreciationContentUseCase.execute(
      request
    )
    return res.status(200).json(result)
  }

  public createPatientQuestionAnswer = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      content: req.body.content,
      user: req.user as User,
      patientQuestionId: req.params.id,
    }
    const result = await this.createPatientQuestionAnswerUseCase.execute(
      request
    )
    return res.status(200).json(result)
  }

  public editPatientQuestionAnswerContent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      content: req.body.content,
      user: req.user as User,
      patientQuestionAnswerId: req.params.id,
    }
    const result = await this.editPatientQuestionAnswerContentUseCase.execute(
      request
    )
    return res.status(200).json(result)
  }

  public createPatientQuestion = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = { ...req.body, user: req.user }
    const result = await this.createPatientQuestionUseCase.execute(request)
    return res.status(200).json(result)
  }

  public editPatientQuestion = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      content: req.body.content,
      medicalSpecialty: req.body.medicalSpecialty,
      user: req.user as User,
      patientQuestionId: req.params.id,
    }
    const result = await this.editPatientQuestionUseCase.execute(request)
    return res.status(200).json(result)
  }

  public cancelAnswerAppreciation = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      answerAppreciationId: req.params.id,
      user: req.user as User,
    }
    const result = await this.cancelAnswerAppreciationUseCase.execute(request)
    return res.status(200).json(result)
  }

  public cancelAnswerAgreement = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      answerId: req.params.id,
      user: req.user as User,
    }
    const result = await this.cancelAnswerAgreementUseCase.execute(request)
    return res.status(200).json(result)
  }

  public cancelPatientQuestionAnswer = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      answerId: req.params.id,
      user: req.user as User,
    }
    const result = await this.cancelPatientQuestionAnswerUseCase.execute(
      request
    )
    return res.status(200).json(result)
  }

  public cancelPatientQuestion = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      patientQuestionId: req.params.id,
      user: req.user as User,
    }
    const result = await this.cancelPatientQuestionUseCase.execute(request)
    return res.status(200).json(result)
  }

  public getSingleQuestion = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      patientQuestionId: req.params.id,
      user: req.user as User,
    }
    const result = await this.getSingleQuestionUseCase.execute(request)
    return res.status(200).json(result)
  }

  public getQuestions = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const request = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
    }
    const result = await this.getQuestionsUseCase.execute(request)
    return res.status(200).json(result)
  }
}
