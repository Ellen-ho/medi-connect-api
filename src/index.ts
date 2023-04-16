import 'reflect-metadata'
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import connectDB from './infrastructure/config/typeorm'
import mainRoutes from './infrastructure/http/routes'

dotenv.config()

const app: Express = express()
const port = process.env.API_PORT as string

connectDB
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized`)
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err)
  })

app.use(express.json())
app.use(mainRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
