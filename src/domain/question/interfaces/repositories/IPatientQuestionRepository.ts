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
  deleteById: (id: string, executor?: IExecutor) => Promise<void>
  findAndCountAll: (
    limit: number,
    offset: number
  ) => Promise<{
    total_counts: number
    questions: Array<{
      content: string
    }>
  }>
}
