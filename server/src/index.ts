import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import axios, { AxiosError, AxiosResponse } from 'axios'

const app: Express = express()

app.use(cors())

const requestNetflixAndSendResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const netflixUrl: string = `http://netflix.com${req.path}`
  const { data, status }: AxiosResponse = await axios.get(netflixUrl)
  res.status(status).send(data)
}

const sendDefaultError = (res: Response, status: number = 500): void => {
  res
    .status(status)
    .send({ message: 'Sorry, there was a problem. Please try again later.' })
}

const handleProxyError = (error: unknown, res: Response): void => {
  console.error(error)
  if (error instanceof AxiosError)
    return sendDefaultError(res, error.response?.status)
  return sendDefaultError(res)
}

const tryToProxyToNetflix = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await requestNetflixAndSendResponse(req, res)
  } catch (error) {
    handleProxyError(error, res)
  }
}

app.get('*', tryToProxyToNetflix)

const portWithType = process.env.PORT as number | undefined
const port: number = portWithType || 5000

const handleServerStart = (): void => {
  console.log(`Started server on http://localhost:${port}`)
}

app.listen(port, handleServerStart)
