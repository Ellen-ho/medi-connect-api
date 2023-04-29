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
    private readonly cancelPatientQuestionUseCase: CancelPatientQuestionUseCase
  ) {}

  public createAnswerAgreement = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        comment: req.body.comment,
        user: req.user as User,
        answerId: req.params.id,
      }
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
        comment: req.body.comment,
        user: req.user as User,
        answerAgreementId: req.params.id,
      }
      const result = await this.editAnswerAgreementCommentUseCase.execute(
        request
      )

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res
        .status(400)
        .json({ message: 'edit answer agreement comment error' })
    }
  }

  public createAnswerAppreciation = async (
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

  public editAnswerAppreciationContent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        content: req.body.content,
        user: req.user as User,
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

  public createPatientQuestionAnswer = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        content: req.body.content,
        user: req.user as User,
        patientQuestionId: req.params.id,
      }
      const result = await this.createPatientQuestionAnswerUseCase.execute(
        request
      )

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public editPatientQuestionAnswerContent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        content: req.body.content,
        user: req.user as User,
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

  public createPatientQuestion = async (
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

  public editPatientQuestion = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        content: req.body.content,
        medicalSpecialty: req.body.medicalSpecialty,
        user: req.user as User,
        patientQuestionId: req.params.id,
      }
      const result = await this.editPatientQuestionUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: 'edit patient question error' })
    }
  }

  public cancelAnswerAppreciation = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        answerAppreciationId: req.params.id,
        user: req.user as User,
      }
      const result = await this.cancelAnswerAppreciationUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public cancelAnswerAgreement = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        answerAgreementId: req.params.id,
        user: req.user as User,
      }
      const result = await this.cancelAnswerAgreementUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public cancelPatientQuestionAnswer = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        patientQuestionAnswerId: req.params.id,
        user: req.user as User,
      }
      const result = await this.cancelPatientQuestionAnswerUseCase.execute(
        request
      )

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }

  public cancelPatientQuestion = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const request = {
        patientQuestionId: req.params.id,
        user: req.user as User,
      }
      const result = await this.cancelPatientQuestionUseCase.execute(request)

      return res.status(200).json(result)
    } catch (error) {
      // TODO: move this to a middleware
      return res.status(400).json({ message: (error as Error).message })
    }
  }
}
