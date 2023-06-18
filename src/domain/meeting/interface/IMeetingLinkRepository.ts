import { IBaseRepository } from '../../shared/IBaseRepository'
import { MeetingLink, MeetingLinkStatus } from '../MeetingLink'

export interface IMeetingLinkRepository extends IBaseRepository<MeetingLink> {
  findRandomByStatus: (status: MeetingLinkStatus) => Promise<MeetingLink | null>
}
