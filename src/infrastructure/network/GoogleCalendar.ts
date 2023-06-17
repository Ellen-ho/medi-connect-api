import { OAuth2Client } from 'google-auth-library'
import { calendar_v3, google } from 'googleapis'
import { GaxiosPromise } from 'googleapis/build/src/apis/oauth2'

export class GoogleCalendar {
  private readonly oauth2Client: OAuth2Client
  public readonly calendar: calendar_v3.Calendar
  
  constructor(clientId: string, clientSecret: string, accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: 'refresh_token',
      expiry_date: 10000000000000,
    })
  }

  async createEvent(): GaxiosPromise<calendar_v3.Schema$Event> {
    const event = {
      summary: 'Test event',
      description: 'Google add event testing.',
      start: {
        dateTime: '2023-06-13T01:00:00-07:00',
        timeZone: 'Asia/Taipei',
      },
      end: {
        dateTime: '2023-06-13T03:00:00-07:00',
        timeZone: 'Asia/Taipei',
      },
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: { type: 'hangoutsMeet' },
          requestId: 'sample1234',
        },
      },
    }

    return await this.calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event,
    })
  }
}
