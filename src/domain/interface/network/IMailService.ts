export interface ISendMailParams {
  to: Array<{
    email: string
  }>
  subject: string
  text: string
}

export interface IMailService {
  sendMail: (params: ISendMailParams) => Promise<void>
}
