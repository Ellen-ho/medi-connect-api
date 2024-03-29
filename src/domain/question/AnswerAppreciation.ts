import { Patient } from '../patient/Patient'
import { PatientQuestionAnswer } from './PatientQuestionAnswer'

export interface IAnswerAppreciationProps {
  id: string
  content: string | null
  patient: Patient
  answer: PatientQuestionAnswer
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export class AnswerAppreciation {
  constructor(private readonly props: IAnswerAppreciationProps) {}

  public get id(): string {
    return this.props.id
  }

  public get content(): string | null {
    return this.props.content
  }

  public get patient(): Patient {
    return this.props.patient
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

  public get deletedAt(): Date | undefined {
    return this.props.deletedAt
  }

  public updateContent(content: string): void {
    this.props.content = content
  }
}
