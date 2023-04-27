import { PatientQuestion } from '../../../domain/question/PatientQuestion'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { PatientMapper } from '../patient/PatientMapper'
import { PatientQuestionEntity } from './PatientQuestionEntity'

export class PatientQuestionMapper
  implements IEntityMapper<PatientQuestionEntity, PatientQuestion>
{
  public toDomainModel(entity: PatientQuestionEntity): PatientQuestion {
    const patientQuestion = new PatientQuestion({
      id: entity.id,
      content: entity.content,
      medicalSpecialty: entity.medicalSpecialty,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      asker: new PatientMapper().toDomainModel(entity.asker),
    })
    return patientQuestion
  }

  public toPersistence(domainModel: PatientQuestion): PatientQuestionEntity {
    const patientQuestionEntity = new PatientQuestionEntity()
    patientQuestionEntity.id = domainModel.id
    patientQuestionEntity.content = domainModel.content
    patientQuestionEntity.medicalSpecialty = domainModel.medicalSpecialty
    patientQuestionEntity.createdAt = domainModel.createdAt
    patientQuestionEntity.updatedAt = domainModel.updatedAt
    patientQuestionEntity.asker = new PatientMapper().toPersistence(
      domainModel.asker
    )

    return patientQuestionEntity
  }
}
