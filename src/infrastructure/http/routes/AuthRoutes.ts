import { Router } from 'express'
import {
  facebookAuthenticator,
  facebookCallbackAuthenticator,
} from '../middlewares/Auth'
import { asyncHandler } from '../middlewares/AsyncHandler'
import { IUserController } from '../controllers/UserController'

export class AuthRoutes {
  private readonly routes: Router

  constructor(private readonly userController: IUserController) {
    this.routes = Router()

    this.routes.get('/facebook', facebookAuthenticator)
    this.routes.get('/facebook/callback', facebookCallbackAuthenticator)
    this.routes.get('/success', asyncHandler(this.userController.login))

    // this.routes.get(
    //   '/success',
    //   (req: Request, res: Response, next: NextFunction): void => {
    //     const { user } = req
    //     if (user != null) {
    //       res.status(200).json({
    //         success: true,
    //         message: 'successfull',
    //         user: req.user,
    //       })
    //     }
    //   }
    // )
  }

  public createRouter(): Router {
    return this.routes
  }
}
