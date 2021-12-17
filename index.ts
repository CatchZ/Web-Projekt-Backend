import { Request,Response } from "express";
const express = require('express')
const app = express()
const port = const port = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
