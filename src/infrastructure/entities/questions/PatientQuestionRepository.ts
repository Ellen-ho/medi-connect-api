import { DataSource } from 'typeorm'
import { PatientQuestion } from '../../../domain/question/PatientQuestion'
import { BaseRepository } from '../BaseRepository'
import { PatientQuestionEntity } from './PatientQuestionEntity'
import { PatientQuestionMapper } from './PatientQuestionMapper'
import { IPatientQuestionRepository } from '../../../domain/question/interfaces/repositories/IPatientQuestionRepository'

export class PatientQuestionRepository
  extends BaseRepository<PatientQuestionEntity, PatientQuestion>
  implements IPatientQuestionRepository
{
  constructor(dataSource: DataSource) {
    super(PatientQuestionEntity, new PatientQuestionMapper(), dataSource)
  }

  public async findById(id: string): Promise<PatientQuestion | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async findByIdAndAskerId(
    patientQuestionId: string,
    askerId: string
  ): Promise<PatientQuestion | null> {
    try {
      const entity = await this.getRepo()
        .createQueryBuilder('patient_questions')
        .leftJoinAndSelect('patient_questions.asker', 'asker')
        .where('patient_questions.id = :patientQuestionId', {
          patientQuestionId,
        })
        .andWhere('askers.id = :askerId', { askerId })
        .getOne()
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findByIdAndPatientId error')
    }
  }

  public async deleteById(id: string): Promise<void> {
    try {
      await this.getRepo()
        .createQueryBuilder('patient_questions')
        .softDelete()
        .where('id = :id', { id })
        .execute()
    } catch (e) {
      throw new Error('repository countsById error')
    }
  }
}
