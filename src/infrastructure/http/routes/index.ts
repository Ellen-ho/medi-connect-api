import { Router } from 'express'
import userRoutes from './UserRoutes'

const mainRoutes = Router()

mainRoutes.use('/users', userRoutes)

export default mainRoutes
