import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { asyncHandler } from '../middlewares/asyncHandler'

const userController = new UserController()
const userRoutes = Router()

userRoutes.get('/', asyncHandler(userController.getUser))
userRoutes.post('/', asyncHandler(userController.createUser))

export default userRoutes
