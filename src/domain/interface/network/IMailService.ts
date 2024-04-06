export interface ISendMailParams {
  to: string[]
  subject: string
  text: string
}

export interface IMailService {
  sendMail: (params: ISendMailParams) => Promise<void>
}
