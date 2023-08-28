import { IMeetingLinkProvider } from '../../domain/interface/network/IMeetingLinkProvider'

export class LocalMeetingLinkProvider implements IMeetingLinkProvider {
  async getMeetingLink(): Promise<string> {
    return 'https://meet.google.com/xxx-xxx-xxx'
  }
}
