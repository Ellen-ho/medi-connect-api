import { IBaseRepository } from '../../../shared/IBaseRepository'
import { AnswerAgreement } from '../../AnswerAgreement'

export interface IAnswerAgreementRepository
  extends IBaseRepository<AnswerAgreement> {
  findById: (id: string) => Promise<AnswerAgreement | null>
  findAllByAnswerId: (id: string, take?: number) => Promise<AnswerAgreement[]>
  findByIdAndAgreedDoctorId: (
    answerAgreementId: string,
    agreedDoctorId: string
  ) => Promise<AnswerAgreement | null>
  countsByAnswerId: (answerId: string) => Promise<number>
  findAgreedDoctorAvatarsByAnswerId: (
    answerId: string
  ) => Promise<Array<string | null>>
  findByAnswerIdAndAgreedDoctorId: (
    answerId: string,
    agreedDoctorId: string
  ) => Promise<AnswerAgreement | null>
  deleteById: (id: string) => Promise<void>
  deleteAllByAnswerId: (answerId: string) => Promise<void>
}
