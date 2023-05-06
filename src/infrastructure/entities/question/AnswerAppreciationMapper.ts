import { PatientQuestionAnswerMapper } from './PatientQuestionAnswerMapper'
import { PatientMapper } from '../patient/PatientMapper'
import { AnswerAppreciation } from '../../../domain/question/AnswerAppreciation'
import { AnswerAppreciationEntity } from './AnswerAppreciationEntity'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'

export class AnswerAppreciationMapper
  implements IEntityMapper<AnswerAppreciationEntity, AnswerAppreciation>
{
  public toDomainModel(entity: AnswerAppreciationEntity): AnswerAppreciation {
    const answerAppreciation = new AnswerAppreciation({
      id: entity.id,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      answer: new PatientQuestionAnswerMapper().toDomainModel(entity.answer),
      patient: new PatientMapper().toDomainModel(entity.patient),
    })
    return answerAppreciation
  }

  public toPersistence(
    domainModel: AnswerAppreciation
  ): AnswerAppreciationEntity {
    const answerAppreciationEntity = new AnswerAppreciationEntity()
    answerAppreciationEntity.id = domainModel.id
    answerAppreciationEntity.content = domainModel.content
    answerAppreciationEntity.createdAt = domainModel.createdAt
    answerAppreciationEntity.updatedAt = domainModel.updatedAt
    answerAppreciationEntity.patient = new PatientMapper().toPersistence(
      domainModel.patient
    )
    answerAppreciationEntity.answer =
      new PatientQuestionAnswerMapper().toPersistence(domainModel.answer)

    return answerAppreciationEntity
  }
}
