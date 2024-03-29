import { IUserRepository } from 'domain/user/interfaces/repositories/IUserRepository'
import { NotFoundError } from 'infrastructure/error/NotFoundError'
import jwt from 'jsonwebtoken'

interface CreatePasswordChangeMailRequest {
  email: string
}

interface CreatePasswordChangeMailResponse {
  success: boolean
  error?: string
}

export class CreatePasswordChangeMailUseCase {
  // private mailtrapClient: MailtrapClient,
  // private readonly senderEmail: string = '<SENDER@YOURDOMAIN.COM>' // 应从配置中获取

  constructor(private readonly userRepository: IUserRepository) {
    // const token: string = process.env.MAILTRAP_TOKEN
    // this.mailtrapClient = new MailtrapClient({ token })
  }

  public async execute(
    request: CreatePasswordChangeMailRequest
  ): Promise<CreatePasswordChangeMailResponse> {
    const { email } = request

    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser == null) {
      throw new NotFoundError('This user does not exist.')
    }

    const userEmail = existingUser.email // 用户的电子邮件

    // 生成重置令牌
    const resetToken = jwt.sign(
      { id: existingUser.id, mail: userEmail },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '30min',
      }
    )
    const passwordResetLink = `${
      process.env.CLIENT_URL as string
    }/reset-password?token=${resetToken}`

    console.log(resetToken)

    // const sender = { name: 'Medi Connect', email: this.senderEmail }

    try {
      // await this.mailtrapClient.send({
      //   from: sender,
      //   to: [{ email: recipientEmail }],
      //   subject: 'Password Reset',
      //   text: `Click here to reset your password: ${passwordResetLink}`,
      // })

      console.table({
        mailLink: passwordResetLink,
      })
      return { success: true }
    } catch (error) {
      if (error instanceof NotFoundError) {
        return { success: false, error: error.message }
      }
      // 其他类型的错误，继续抛出
      throw error
    }
  }
}
