import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { AnswerAgreementEntity } from './AnswerAgreementEntity'
import { AnswerAgreement } from '../../../domain/question/AnswerAgreement'
import { AnswerAgreementMapper } from './AnswerAgreementMapper'
import { IAnswerAgreementRepository } from '../../../domain/question/interfaces/repositories/IAnswerAgreementRepository'

export class AnswerAgreementRepository
  extends BaseRepository<AnswerAgreementEntity, AnswerAgreement>
  implements IAnswerAgreementRepository
{
  constructor(dataSource: DataSource) {
    super(AnswerAgreementEntity, new AnswerAgreementMapper(), dataSource)
  }

  public async findById(id: string): Promise<AnswerAgreement | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }
}
