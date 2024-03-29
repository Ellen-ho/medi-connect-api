import { Router } from 'express'
import { IUserController } from '../controllers/UserController'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { authenticated, authenticator } from '../middlewares/Auth'
import { validator } from '../middlewares/Validator'
import {
  createPasswordChangeMailSchema,
  editUserAccountSchema,
  logInUserSchema,
  registerUserSchema,
  updatePasswordSchema,
} from '../../../application/user/UserValidator'
import upload from '../middlewares/multer'
export class UserRoutes {
  private readonly routes: Router
  constructor(private readonly userController: IUserController) {
    this.routes = Router()
    this.routes
      .post(
        '/login',
        validator(logInUserSchema),
        authenticator,
        asyncHandler(this.userController.login)
      )
      .get(
        '/account',
        authenticated,
        asyncHandler(this.userController.getUserAccount)
      )
      .post(
        '/',
        validator(registerUserSchema),
        asyncHandler(this.userController.registerNewUser)
      )
      .patch(
        '/account',
        authenticated,
        validator(editUserAccountSchema),
        asyncHandler(this.userController.editUserAccount)
      )
      .post(
        '/upload-avatar',
        upload.fields([{ name: 'avatar', maxCount: 1 }]),
        asyncHandler(this.userController.uploadAvatar)
      )
      .post(
        '/reset-password-mail',
        // resetPasswordAuthenticated
        validator(createPasswordChangeMailSchema),
        asyncHandler(this.userController.createPasswordChangeMail)
      )
      .patch(
        '/reset-password',
        // resetPasswordAuthenticated
        validator(updatePasswordSchema),
        asyncHandler(this.userController.updatePassword)
      )
  }

  public createRouter(): Router {
    return this.routes
  }
}
