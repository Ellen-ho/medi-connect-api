import { PatientQuestion } from '../../PatientQuestion'

export interface IPatientQuestionRepository {
  findById: (id: string) => Promise<PatientQuestion | null>
  findByIdAndAskerId: (
    patientQuestionAnswerId: string,
    askerId: string
  ) => Promise<PatientQuestion | null>
  save: (patientQuestion: PatientQuestion) => Promise<void>
}
