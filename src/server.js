import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT

const app = express()

const dataBase = '../database/notes.json'

app.get('/', (req, res) => {
  res.send(`"message":"Server is up and running"`)
})

app.listen(port, () => {
  console.log(`"message": "Server is up and running on ${port}"`)
})
