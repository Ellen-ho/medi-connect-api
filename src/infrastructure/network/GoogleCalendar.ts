import { OAuth2Client } from 'google-auth-library'
import { calendar_v3, google } from 'googleapis'
import { GaxiosPromise } from 'googleapis/build/src/apis/oauth2'

export class GoogleCalendar {
  private readonly oauth2Client: OAuth2Client
  public readonly calendar: calendar_v3.Calendar

  constructor(clientId: string, clientSecret: string) {
    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
    this.oauth2Client.setCredentials({
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      expiry_date: 10000000000000,
    })
  }

  async createEvent(): GaxiosPromise<calendar_v3.Schema$Event> {
    const event = {
      summary: 'Test event',
      description: 'Google add event testing.',
      start: {
        dateTime: '2021-11-28T01:00:00-07:00',
        timeZone: 'Asia/kolkata',
      },
      end: {
        dateTime: '2021-11-28T05:00:00-07:00',
        timeZone: 'Asia/Kolkata',
      },
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    }

    return await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    })
  }
}
