import { IMeetingLinkProvider } from "../../domain/interface/network/IMeetingLinkProvider";

// Add 
export class LocalMeetingLinkProvider implements IMeetingLinkProvider {

  async getMeetingLink(): Promise<string> {
    return 'https://meet.google.com/xxx-xxx-xxx'
  }
}
