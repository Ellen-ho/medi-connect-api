import { IBaseRepository } from '../../../shared/IBaseRepository'
import { PatientQuestionAnswer } from '../../PatientQuestionAnswer'

export interface IPatientQuestionAnswerRepository
  extends IBaseRepository<PatientQuestionAnswer> {
  findById: (id: string) => Promise<PatientQuestionAnswer | null>
  findByIdAndDoctorId: (
    patientQuestionAnswerId: string,
    doctorId: string
  ) => Promise<PatientQuestionAnswer | null>
  findAllByQuestionId: (questionId: string) => Promise<PatientQuestionAnswer[]>
  deleteAllByQuestionId: (questionId: string) => Promise<void>
  deleteById: (id: string) => Promise<void>
}
