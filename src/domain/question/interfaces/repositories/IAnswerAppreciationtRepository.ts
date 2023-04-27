import { AnswerAppreciation } from '../../AnswerAppreciation'

export interface IAnswerAppreciationRepository {
  findById: (id: string) => Promise<AnswerAppreciation | null>
  save: (answerAppreciation: AnswerAppreciation) => Promise<void>
}
