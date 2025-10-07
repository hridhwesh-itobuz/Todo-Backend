import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './router/routes.js'

dotenv.config()
const port = process.env.PORT

const app = express()
app.use(express.json())

app.use(cors())

const sc = {
  success: true,
  message: `server is up and running ${port}`,
}

app.get('/', (req, res) => {
  res.send(sc)
})

app.use(router)

// eslint-disable-next-line
app.use((err, req, res, next) => {
  try {
    return res.status(res.statusCode === 200 ? 500 : res.statusCode).send({
      success: false,
      message: err.message,
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    })
  }
})

app.listen(port, () => {
  console.log(`"message": "server is up and running"`)
})
