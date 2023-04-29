import { PatientQuestionAnswer } from '../../../domain/question/PatientQuestionAnswer'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { PatientQuestionAnswerEntity } from './PatientQuestionAnswerEntity'

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
      patientQuestionId: entity.patientQuestionId,
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
    patientQuestionAnswerEntity.patientQuestionId =
      domainModel.patientQuestionId
    patientQuestionAnswerEntity.doctorId = domainModel.doctorId

    return patientQuestionAnswerEntity
  }
}
