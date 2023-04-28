import { PatientQuestionAnswer } from '../../PatientQuestionAnswer'

export interface IPatientQuestionAnswerRepository {
  findById: (id: string) => Promise<PatientQuestionAnswer | null>
  findByIdAndDoctorId: (
    patientQuestionAnswerId: string,
    doctorId: string
  ) => Promise<PatientQuestionAnswer | null>
  findAllByQuestionId: (questionId: string) => Promise<PatientQuestionAnswer[]>
  deleteAllByQuestionId: (questionId: string) => Promise<void>
  deleteById: (id: string) => Promise<void>
  save: (patientQuestionAnswer: PatientQuestionAnswer) => Promise<void>
}
