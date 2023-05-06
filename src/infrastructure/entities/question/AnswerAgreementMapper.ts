import { AnswerAgreement } from '../../../domain/question/AnswerAgreement'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { AnswerAgreementEntity } from './AnswerAgreementEntity'

export class AnswerAgreementMapper
  implements IEntityMapper<AnswerAgreementEntity, AnswerAgreement>
{
  public toDomainModel(entity: AnswerAgreementEntity): AnswerAgreement {
    const answerAgreement = new AnswerAgreement({
      id: entity.id,
      comment: entity.comment,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      answerId: entity.answerId,
      agreedDoctorId: entity.agreedDoctorId,
    })
    return answerAgreement
  }

  public toPersistence(domainModel: AnswerAgreement): AnswerAgreementEntity {
    const answerAgreementEntity = new AnswerAgreementEntity()
    answerAgreementEntity.id = domainModel.id
    answerAgreementEntity.comment = domainModel.comment
    answerAgreementEntity.createdAt = domainModel.createdAt
    answerAgreementEntity.updatedAt = domainModel.updatedAt
    answerAgreementEntity.answerId = domainModel.answerId
    answerAgreementEntity.agreedDoctorId = domainModel.agreedDoctorId
    return answerAgreementEntity
  }
}
