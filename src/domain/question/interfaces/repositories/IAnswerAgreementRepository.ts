import { IBaseRepository } from '../../../shared/IBaseRepository'
import { IExecutor } from '../../../shared/IRepositoryTx'
import { AnswerAgreement } from '../../AnswerAgreement'

export interface IAnswerAgreementRepository
  extends IBaseRepository<AnswerAgreement> {
  findById: (id: string) => Promise<AnswerAgreement | null>
  findAllByAnswerId: (id: string, take?: number) => Promise<AnswerAgreement[]> // not use
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
  deleteById: (id: string, executor?: IExecutor) => Promise<void>
  deleteAllByAnswerId: (answerId: string, executor?: IExecutor) => Promise<void>
  findByDoctorId: (doctorId: string) => Promise<AnswerAgreement[]>
  findByAnswerId: (answerId: string) => Promise<
    Array<{
      comment: string | null
      agreedDoctorId: string
      agreedDoctorFirstName: string
      agreedDoctorLastName: string
      createdAt: Date
    }>
  >
}
