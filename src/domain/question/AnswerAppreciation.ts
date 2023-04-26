import { Patient } from '../patient/Patient'
import { PatientQuestionAnswer } from './PatientQuestionAnswer'

export interface IAnswerAppreciationProps {
  id: string
  content: string
  patient: Patient
  answer: PatientQuestionAnswer
  createdAt: Date
  updatedAt: Date
}

export class AnswerAppreciation {
  constructor(private readonly props: IAnswerAppreciationProps) {}

  public get id(): string {
    return this.props.id
  }

  public get content(): string {
    return this.props.content
  }

  public get answer(): PatientQuestionAnswer {
    return this.props.answer
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
