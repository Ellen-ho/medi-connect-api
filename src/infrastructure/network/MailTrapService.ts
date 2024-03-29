import {
  IMailService,
  ISendMailParams,
} from '../../domain/interface/network/IMailService'
import { MailtrapClient } from 'mailtrap'

const TOKEN = process.env.MAILTRAP_TOKEN as string
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL as string
const SENDER_NAME = process.env.MAILTRAP_SENDER_NAME as string

export class MailTrapService implements IMailService {
  private readonly client: MailtrapClient
  private readonly sneder

  constructor() {
    this.client = new MailtrapClient({ token: TOKEN })
    this.sneder = {
      name: SENDER_NAME,
      email: SENDER_EMAIL,
    }
  }

  async sendMail(params: ISendMailParams): Promise<void> {
    const { to, subject, text } = params
    console.table({ from: this.sneder, to, subject, text })
    const response = await this.client.send({
      from: this.sneder,
      to,
      subject,
      text,
    })

    console.table({ resp: JSON.stringify(response) })
  }
}
