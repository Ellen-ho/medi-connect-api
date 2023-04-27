import { AnswerAgreement } from '../../AnswerAgreement'

export interface IAnswerAgreementRepository {
  findById: (id: string) => Promise<AnswerAgreement | null>
  countsByAnswerId: (id: string) => Promise<number>
  findAllByAnswerId: (id: string, take?: number) => Promise<AnswerAgreement[]>
  save: (answerAgreement: AnswerAgreement) => Promise<void>
}
