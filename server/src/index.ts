import express, { Express } from 'express'
import { RequestHandler, createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors'

const app: Express = express()

app.use(cors())

// todo: fix this not working
const proxyMiddleware: RequestHandler = createProxyMiddleware({
  target: 'https://www.netflix.com',
  changeOrigin: true,
  followRedirects: true,
})

app.use('*', proxyMiddleware)

const port: number = (process.env.PORT as number | undefined) || 5000

const handleServerStart = (): void => {
  console.log(`Started server on http://localhost:${port}`)
}

app.listen(port, handleServerStart)
