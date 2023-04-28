import { PatientQuestion } from '../../PatientQuestion'

export interface IPatientQuestionRepository {
  findById: (id: string) => Promise<PatientQuestion | null>
  findByIdAndAskerId: (
    patientQuestionAnswerId: string,
    askerId: string
  ) => Promise<PatientQuestion | null>
  deleteById: (id: string) => Promise<void>
  save: (patientQuestion: PatientQuestion) => Promise<void>
}
