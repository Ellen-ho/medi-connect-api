import { AnswerAgreement } from '../../AnswerAgreement'

export interface IAnswerAgreementRepository {
  findById: (id: string) => Promise<AnswerAgreement | null>
  save: (answerAgreement: AnswerAgreement) => Promise<void>
}
