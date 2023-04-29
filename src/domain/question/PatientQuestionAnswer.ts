import { PatientQuestion } from './PatientQuestion'

export interface IPatientQuestionAnswerProps {
  id: string
  content: string
  patientQuestion: PatientQuestion
  doctorId: string
  createdAt: Date
  updatedAt: Date
}

export class PatientQuestionAnswer {
  constructor(private readonly props: IPatientQuestionAnswerProps) {}

  public get id(): string {
    return this.props.id
  }

  public get content(): string {
    return this.props.content
  }

  public get patientQuestion(): PatientQuestion {
    return this.props.patientQuestion
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get doctorId(): string {
    return this.props.doctorId
  }

  public updateContent(content: string): void {
    this.props.content = content
  }
}
