import { PatientQuestionAnswer } from '../../../domain/question/PatientQuestionAnswer'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { PatientQuestionAnswerEntity } from './PatientQuestionAnswerEntity'
import { PatientQuestionMapper } from './PatientQuestionMapper'

export class PatientQuestionAnswerMapper
  implements IEntityMapper<PatientQuestionAnswerEntity, PatientQuestionAnswer>
{
  public toDomainModel(
    entity: PatientQuestionAnswerEntity
  ): PatientQuestionAnswer {
    const patientQuestionAnswer = new PatientQuestionAnswer({
      id: entity.id,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patientQuestion: new PatientQuestionMapper().toDomainModel(
        entity.patientQuestion
      ),
      doctorId: entity.doctorId,
    })
    return patientQuestionAnswer
  }

  public toPersistence(
    domainModel: PatientQuestionAnswer
  ): PatientQuestionAnswerEntity {
    const patientQuestionAnswerEntity = new PatientQuestionAnswerEntity()
    patientQuestionAnswerEntity.id = domainModel.id
    patientQuestionAnswerEntity.content = domainModel.content
    patientQuestionAnswerEntity.createdAt = domainModel.createdAt
    patientQuestionAnswerEntity.updatedAt = domainModel.updatedAt
    patientQuestionAnswerEntity.patientQuestion =
      new PatientQuestionMapper().toPersistence(domainModel.patientQuestion)
    patientQuestionAnswerEntity.doctorId = domainModel.doctorId

    return patientQuestionAnswerEntity
  }
}
