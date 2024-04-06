import { IMailService } from '../../domain/interface/network/IMailService'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import jwt from 'jsonwebtoken'
import { getResetPasswordTemplate } from './constant/MailTemplate'

interface CreatePasswordChangeMailRequest {
  email: string
}

interface CreatePasswordChangeMailResponse {
  success: boolean
  error?: string
}

export class CreatePasswordChangeMailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailService: IMailService
  ) {}

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

    const htmlMailTemplate = getResetPasswordTemplate({
      resetLink: passwordResetLink,
    })

    try {
      await this.mailService.sendMail({
        to: [userEmail],
        subject: '[Medi-connet] Password Reset',
        html: htmlMailTemplate,
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
