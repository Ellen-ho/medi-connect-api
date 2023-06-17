import { IBaseRepository } from '../../shared/IBaseRepository'
import { MeetingLink } from '../MeetingLink'

export interface IMeetingLinkRepository extends IBaseRepository<MeetingLink> {
  findRandomByStatus: () => Promise<string | null>
}
