import { IBaseRepository } from '../../../shared/IBaseRepository'
import { IExecutor } from '../../../shared/IRepositoryTx'
import { PatientQuestion } from '../../PatientQuestion'

export interface IPatientQuestionRepository
  extends IBaseRepository<PatientQuestion> {
  findById: (id: string) => Promise<PatientQuestion | null>
  findByIdAndAskerId: (
    patientQuestionAnswerId: string,
    askerId: string
  ) => Promise<PatientQuestion | null>
  findAndCountAll: (
    limit: number,
    offset: number
  ) => Promise<{
    totalCounts: number
    questions: Array<{
      id: string
      content: string
      createdAt: Date
      answerCounts: number
    }>
  }>
  delete: (question: PatientQuestion, executo?: IExecutor) => Promise<void>
}
