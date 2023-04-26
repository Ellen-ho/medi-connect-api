import { Doctor } from '../doctor/interfaces/Doctor'
import { Patient } from '../patient/Patient'
import { PatientQuestion } from './PatientQuestion'

export interface IPatientQuestionAnswerProps {
  id: string
  content: string
  patientQuestion: PatientQuestion
  doctor: Doctor
  createdAt: Date
  updatedAt: Date
  asker: Patient
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

  public get doctor(): Doctor {
    return this.props.doctor
  }
}
