import { MeetingLink } from '../../../domain/meeting/MeetingLink'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { MeetingLinkEntity } from './MeetingLinkEntity'

export class MeetingLinkMapper implements IEntityMapper<MeetingLinkEntity, MeetingLink> {
  public toDomainModel(entity: MeetingLinkEntity): MeetingLink {
    const meetingLink = new MeetingLink({
      id: entity.id,
      link: entity.link,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
    return meetingLink
  }

  public toPersistence(domainModel: MeetingLink): MeetingLinkEntity {
    const userEntity = new MeetingLinkEntity()
    userEntity.id = domainModel.id
    userEntity.link = domainModel.link
    userEntity.status = domainModel.status
    userEntity.createdAt = domainModel.createdAt
    userEntity.updatedAt = domainModel.updatedAt

    return userEntity
  }
}
