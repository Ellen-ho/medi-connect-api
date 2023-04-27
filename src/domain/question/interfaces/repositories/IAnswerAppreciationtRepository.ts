import { AnswerAppreciation } from '../../AnswerAppreciation'

export interface IAnswerAppreciationRepository {
  findById: (id: string) => Promise<AnswerAppreciation | null>
  findByIdAndPatientId: (
    answerAppreciationId: string,
    patientId: string
  ) => Promise<AnswerAppreciation | null>
  countByAnswerId: (answerId: string) => Promise<number>
  save: (answerAppreciation: AnswerAppreciation) => Promise<void>
}
