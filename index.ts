const express = require('express')
const app = express()
const port = const port = process.env.PORT || 3000
app.get('/', (req, res) => {
  res.send({headers: req.headers})
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
