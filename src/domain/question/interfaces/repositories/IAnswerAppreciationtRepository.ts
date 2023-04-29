import { IBaseRepository } from '../../../shared/IBaseRepository'
import { AnswerAppreciation } from '../../AnswerAppreciation'

export interface IAnswerAppreciationRepository
  extends IBaseRepository<AnswerAppreciation> {
  findById: (id: string) => Promise<AnswerAppreciation | null>
  findByIdAndPatientId: (
    answerAppreciationId: string,
    patientId: string
  ) => Promise<AnswerAppreciation | null>
  countByAnswerId: (answerId: string) => Promise<number>
  deleteById: (id: string) => Promise<void>
  deleteAllByAnswerId: (answerId: string) => Promise<void>
}
