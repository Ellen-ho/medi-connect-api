import { DataSource } from 'typeorm'
import { PatientQuestionAnswer } from '../../../domain/question/PatientQuestionAnswer'
import { PatientQuestionAnswerEntity } from './PatientQuestionAnswerEntity'
import { PatientQuestionAnswerMapper } from './PatientQuestionAnswerMapper'
import { BaseRepository } from '../BaseRepository'
import { IPatientQuestionAnswerRepository } from '../../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'

export class PatientQuestionAnswerRepository
  extends BaseRepository<PatientQuestionAnswerEntity, PatientQuestionAnswer>
  implements IPatientQuestionAnswerRepository
{
  constructor(dataSource: DataSource) {
    super(
      PatientQuestionAnswerEntity,
      new PatientQuestionAnswerMapper(),
      dataSource
    )
  }

  public async findById(id: string): Promise<PatientQuestionAnswer | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async findByIdAndDoctorId(
    patientQuestionAnswerId: string,
    doctorId: string
  ): Promise<PatientQuestionAnswer | null> {
    try {
      const entity = await this.getRepo()
        .createQueryBuilder('patient_question_answers')
        .leftJoinAndSelect('patient_question_answers.doctor', 'doctor')
        .where('patient_question_answers.id = :patientQuestionAnswerId', {
          patientQuestionAnswerId,
        })
        .andWhere('doctors.id = :doctorId', { doctorId })
        .getOne()
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findByIdAndPatientId error')
    }
  }

  public async findAllByQuestionId(
    questionId: string
  ): Promise<PatientQuestionAnswer[]> {
    try {
      const entities = await this.getRepo()
        .createQueryBuilder('patient_question_answers')
        .where('patient_question_id = :questionId', {
          questionId,
        })
        .getMany()
      return entities.map((entity) => this.getMapper().toDomainModel(entity))
    } catch (e) {
      throw new Error('repository findByIdAndPatientId error')
    }
  }

  public async deleteById(id: string): Promise<void> {
    try {
      await this.getRepo()
        .createQueryBuilder('patient_question_answers')
        .softDelete()
        .where('id = :id', { id })
        .execute()
    } catch (e) {
      throw new Error('repository countsByAnswerId error')
    }
  }

  public async deleteAllByQuestionId(questionId: string): Promise<void> {
    try {
      await this.getRepo()
        .createQueryBuilder('patient_question_answers')
        .softDelete()
        .where('patient_question_id = :questionId', { questionId })
        .execute()
    } catch (e) {
      throw new Error('repository deleteAllByQuestionId error')
    }
  }
}
