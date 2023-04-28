import { Doctor } from '../doctor/interfaces/Doctor'
import { PatientQuestionAnswer } from './PatientQuestionAnswer'

export interface IAnswerAgreementProps {
  id: string
  answer: PatientQuestionAnswer
  agreedDoctor: Doctor
  comment: string | null
  createdAt: Date
  updatedAt: Date
}

export class AnswerAgreement {
  constructor(private readonly props: IAnswerAgreementProps) {}

  public get id(): string {
    return this.props.id
  }

  public get answer(): PatientQuestionAnswer {
    return this.props.answer
  }

  public get agreedDoctor(): Doctor {
    return this.props.agreedDoctor
  }

  public get comment(): string | null {
    return this.props.comment
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public updateComment(comment: string): void {
    this.props.comment = comment
  }
}
