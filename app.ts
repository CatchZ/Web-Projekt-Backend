import { Request,Response } from "express";
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
//require('./init_redis');

const redis = require("redis");
const client = redis.createClient({url: process.env.REDIS_URL});



//app.get('/', (req: { headers: any }, res: { send: (arg0: { headers: any }) => void }) => {
app.get('/', (req: Request, res: Response) => {
    res.send({headers: req.headers})
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const BASE_URL = "https://reisen-reisen.herokuapp.com/";

const form = document.querySelector('form');

const email = document.querySelector('input[name=email]');
const password = document.querySelector('input[name=passwort]')

const loginError = document.querySelector('.loginFailed');

const login = async (email: any, password: String) => {
    const loginUrl = `${BASE_URL}/users`;

    const response = await fetch(loginUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    });
    return response.status === 200;
}


