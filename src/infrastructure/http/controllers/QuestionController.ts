import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateAnswerAgreementUseCase } from '../../../application/question/CreateAnswerAgreementUseCase'
import { CreateAnswerAppreciationUseCase } from '../../../application/question/CreateAnswerAppreciationUseCase'
import { CreatePatientQuestionAnswerUseCase } from '../../../application/question/CreatePatientQuestionAnswerUseCase'
import { CreatePatientQuestionUseCase } from '../../../application/question/CreatePatientQuestionUseCase'

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
}

export class QuestionController implements IQuestionController {
  constructor(
    private readonly createAnswerAgreementUseCase: CreateAnswerAgreementUseCase,
    private readonly editAnswerAgreementComment: EditAnswerAgreementCommentUseCase,
    private readonly createAnswerAppreciationUseCase: CreateAnswerAppreciationUseCase,
    private readonly editAnswerAppreciationContentUseCase: EditAnswerAppreciationContentUseCase,
    private readonly createPatientQuestionAnswerUseCase: CreatePatientQuestionAnswerUseCase,
    private readonly editPatientQuestionAnswerContentUseCase: EditPatientQuestionAnswerContentUseCase,
    private readonly createPatientQuestionUseCase: CreatePatientQuestionUseCase,
    private readonly editPatientQuestionUseCase: EditPatientQuestionUseCase,
    private readonly cancelAnswerAppreciationUseCase: CancelAnswerAppreciationUseCase,
    private readonly cancelAnswerAgreementUseCase: CancelAnswerAgreementUseCase,
    private readonly cancelPatientQuestionAnswerUseCase: CancelPatientQuestionAnswerUseCase,
    private readonly cancelPatientQuestionUseCase: CancelPatientQuestionUseCase
  ) {}
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

  public createAnswerAgreement = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const result = await this.createAnswerAgreementUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editAnswerAgreementComment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        AnswerAgreementId: req.params.id,
      }
      const result = await this.editAnswerAgreementComment.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res
        .status(400)
        .json({ message: 'edit answer agreement comment error' })
    }
  }

  public createAnswerAppreciationUseCase = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const result = await this.createAnswerAppreciationUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editAnswerAppreciationContentUseCase = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        answerAppreciationId: req.params.id,
      }
      const result = await this.editAnswerAppreciationContentUseCase.execute(
        request
      )

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res
        .status(400)
        .json({ message: 'edit answer appreciation content error' })
    }
  }

  public createPatientQuestionAnswerUseCase = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const result = await this.createPatientQuestionAnswerUseCase.execute(
        request
      )

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editPatientQuestionAnswerContentUseCase = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        patientQuestionAnswerId: req.params.id,
      }
      const result = await this.editPatientQuestionAnswerContentUseCase.execute(
        request
      )

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res
        .status(400)
        .json({ message: 'edit patient question answer content error' })
    }
  }

  public createPatientQuestionUseCase = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const result = await this.createPatientQuestionUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editPatientQuestionUseCase = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        ...req.body,
        user: req.user,
        patientQuestionId: req.params.id,
      }
      const result = await this.editPatientQuestionUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: 'edit patient question error' })
    }
  }

  public cancelAnswerAppreciationUseCase = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const result = await this.cancelAnswerAppreciationUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public cancelAnswerAgreementUseCase = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const result = await this.cancelAnswerAgreementUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public cancelPatientQuestionAnswerUseCase = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const result = await this.cancelPatientQuestionAnswerUseCase.execute(
        request
      )

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public cancelPatientQuestionUseCase = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = { ...req.body, user: req.user }
      const result = await this.cancelPatientQuestionUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }
}
