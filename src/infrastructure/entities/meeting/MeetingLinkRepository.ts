import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { MeetingLinkMapper } from './MeetingLinkMapper'
import { MeetingLinkEntity } from './MeetingLinkEntity'
import { RepositoryError } from '../../error/RepositoryError'
import { IMeetingLinkRepository } from '../../../domain/meeting/interface/IMeetingLinkRepository'
import { MeetingLink, MeetingLinkStatus } from '../../../domain/meeting/MeetingLink'

export class MeetingLinkRepository
  extends BaseRepository< MeetingLinkEntity,  MeetingLink>
  implements IMeetingLinkRepository
{
  constructor(dataSource: DataSource) {
    super(MeetingLinkEntity, new MeetingLinkMapper(), dataSource)
  }

  public async findRandomByStatus(): Promise<string | null> {
    try {
      const entity = await this.getRepo()
        .createQueryBuilder('meetingLink')
        .where('meetingLink.status = :status', { status: MeetingLinkStatus.AVAILABLE })
        .orderBy('meetingLink.status', 'ASC')
        .getOne();
        
      return entity != null ? entity.link : null
    } catch (e) {
      throw new RepositoryError('UserRepository findById error', e as Error)
    }
  }
}
