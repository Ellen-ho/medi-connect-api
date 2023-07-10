import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { AnswerAgreement } from '../AnswerAgreement'

export const AnswerAgreementFactory = Factory.define<AnswerAgreement>(
  ({ params }) => {
    return new AnswerAgreement({
      id: params.id ?? faker.string.uuid(),
      answerId: params.answerId ?? faker.string.uuid(),
      agreedDoctorId: params.agreedDoctorId ?? faker.string.uuid(),
      comment: params.comment ?? null,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
    })
  }
)
