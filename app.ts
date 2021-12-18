import { Request,Response } from "express";
import {knex as knexDriver} from "knex";
import config from "./knexfile";

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
//require('./init_redis');

const redis = require("redis");
const client = redis.createClient({url: process.env.REDIS_URL});

const knex = knexDriver(config);

//app.get('/', (req: { headers: any }, res: { send: (arg0: { headers: any }) => void }) => {
app.get('/', (req: Request, res: Response) => {
    res.send({headers: req.headers})
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

