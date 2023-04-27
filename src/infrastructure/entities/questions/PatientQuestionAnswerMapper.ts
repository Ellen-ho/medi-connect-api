import { PatientQuestionAnswer } from '../../../domain/question/PatientQuestionAnswer'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { DoctorMapper } from '../doctor/DoctorMapper'
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
      doctor: new DoctorMapper().toDomainModel(entity.doctor),
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
    patientQuestionAnswerEntity.doctor = new DoctorMapper().toPersistence(
      domainModel.doctor
    )

    return patientQuestionAnswerEntity
  }
}
