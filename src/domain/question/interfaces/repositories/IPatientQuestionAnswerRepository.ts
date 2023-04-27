import { PatientQuestionAnswer } from '../../PatientQuestionAnswer'

export interface IPatientQuestionAnswerRepository {
  findById: (id: string) => Promise<PatientQuestionAnswer | null>
  save: (patientQuestionAnswer: PatientQuestionAnswer) => Promise<void>
}
