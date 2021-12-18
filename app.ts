import { Request,Response } from "express";
import {Knex} from "knex";
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
//require('./init_redis');

const redis = require("redis");
const client = redis.createClient({url: process.env.REDIS_URL});
// @ts-ignore
const knex = Knex({
    client: "postgresql",
    connection: "postgresql://user@localhost:5432/expenses",
})


//app.get('/', (req: { headers: any }, res: { send: (arg0: { headers: any }) => void }) => {
app.get('/', (req: Request, res: Response) => {
    res.send({headers: req.headers})
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

