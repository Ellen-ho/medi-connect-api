import { AnswerAgreement } from '../../../domain/question/AnswerAgreement'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { DoctorMapper } from '../doctor/DoctorMapper'
import { AnswerAgreementEntity } from './AnswerAgreementEntity'
import { PatientQuestionAnswerMapper } from './PatientQuestionAnswerMapper'

export class AnswerAgreementMapper
  implements IEntityMapper<AnswerAgreementEntity, AnswerAgreement>
{
  public toDomainModel(entity: AnswerAgreementEntity): AnswerAgreement {
    const answerAgreement = new AnswerAgreement({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      answer: new PatientQuestionAnswerMapper().toDomainModel(entity.answer),
      agreedDoctor: new DoctorMapper().toDomainModel(entity.agreedDoctor),
    })
    return answerAgreement
  }

  public toPersistence(domainModel: AnswerAgreement): AnswerAgreementEntity {
    const answerAgreementEntity = new AnswerAgreementEntity()
    answerAgreementEntity.id = domainModel.id
    answerAgreementEntity.createdAt = domainModel.createdAt
    answerAgreementEntity.updatedAt = domainModel.updatedAt
    answerAgreementEntity.answer =
      new PatientQuestionAnswerMapper().toPersistence(domainModel.answer)
    answerAgreementEntity.agreedDoctor = new DoctorMapper().toPersistence(
      domainModel.agreedDoctor
    )
    return answerAgreementEntity
  }
}
