export interface IMeetingLinkProvider {
    getMeetingLink: () => Promise<string>
}
  