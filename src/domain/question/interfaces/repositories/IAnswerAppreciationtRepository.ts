import { IBaseRepository } from '../../../shared/IBaseRepository'
import { IExecutor } from '../../../shared/IRepositoryTx'
import { AnswerAppreciation } from '../../AnswerAppreciation'

export interface IAnswerAppreciationRepository
  extends IBaseRepository<AnswerAppreciation> {
  findById: (id: string) => Promise<AnswerAppreciation | null>
  findByIdAndPatientId: (
    answerAppreciationId: string,
    patientId: string
  ) => Promise<AnswerAppreciation | null>
  countByAnswerId: (answerId: string) => Promise<number>
  deleteById: (id: string, executor?: IExecutor) => Promise<void>
  deleteAllByAnswerId: (answerId: string, executor?: IExecutor) => Promise<void>
  findByAnswerIdAndPatientId: (
    answerId: string,
    patientId: string
  ) => Promise<AnswerAppreciation | null>
  findByAnswerId: (answerId: string) => Promise<
    Array<{
      content: string | null
      patientId: string
      patientAge: number
      createdAt: Date
    }>
  >
}
