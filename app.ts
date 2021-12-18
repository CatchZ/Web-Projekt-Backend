const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require('./init_redis');


app.get('/', (req: { headers: any }, res: { send: (arg0: { headers: any }) => void }) => {
    res.send({headers: req.headers})
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})