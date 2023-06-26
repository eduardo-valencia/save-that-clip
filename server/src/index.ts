import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import axios, { AxiosResponse } from 'axios'

const app: Express = express()

app.use(cors())

const proxyToNetflix = async (req: Request, res: Response): Promise<void> => {
  const netflixUrl: string = `http://netflix.com${req.path}`
  const { data, status }: AxiosResponse = await axios.get(netflixUrl)
  res.status(status).send(data)
}

app.get('*', proxyToNetflix)

const portWithType = process.env.PORT as number | undefined
const port: number = portWithType || 5000

const handleServerStart = (): void => {
  console.log(`Started server on http://localhost:${port}`)
}

app.listen(port, handleServerStart)
