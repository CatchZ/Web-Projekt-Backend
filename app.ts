import express, {Request} from "express";
import cookieParser from "cookie-parser";
import ReiseService from "./services/ReiseService";
import {HttpError} from "express-openapi-validator/dist/framework/types";
import AuthService from "./services/AuthService";
import {knex as knexDriver} from "knex";
import cors from "cors";
import config from "./knexfile";

const app = express();
const port = process.env.PORT || 3000;

const knex = knexDriver(config);
const reiseService = new ReiseService(knex);
const authService = new AuthService();

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.get('/', async (req, res) => {
    res.send({headers: req.headers});
})


const checkLogin = async (
    req: Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const session = req.cookies.session;
    if (!session) {
        res.status(401);
        return res.json({message: "You need to be logged in to see this page."});
    }
    const email = await authService.getUserEmailForSession(session);
    if (!email) {
        res.status(401);
        return res.json({message: "You need to be logged in to see this page."});
    }
    req.userEmail = email;

    next();
};

app.get("/journeys", checkLogin, async (req, res) => {
    const session = req.cookies.session;
    const email = await authService.getUserEmailForSession(session);
    reiseService.getAll(email).then((total) => res.send(total));
});

app.post("/journeys", checkLogin, async (req, res) => {
    const payload = req.body;
    const session = req.cookies.session;
    const email = await authService.getUserEmailForSession(session);
    //reiseService.add(payload, email).then((newEntry) => res.send(newEntry));
});

app.delete("/journeys/:reiseid", checkLogin, async (req, res) => {
    const id = req.params.reiseid;
    reiseService.delete(id).then(() => {
        res.status(204);
        return res.json({message:"Reise wurde gelöscht!"});
    });
});

app.post("/journeys/:reiseid", checkLogin, async (req, res) => {
    const id = req.params.reiseid;
    const payload = req.body;
    const session = req.cookies.session;
    const email = await authService.getUserEmailForSession(session);
    reiseService.delete(id).then(() => {
        reiseService.add(payload,email).then(()=>{
            res.status(204);
            return res.json({message:"Reise wurde editiert!"});
        })
    });
});

/*
app.post("/register", async (req, res) => {
    const payload = req.body;
    await authService.create({email: payload.email as string, password: payload.password as string}).then(() => {
        res.status(201);
        return res.json({message: "User erstellt"});
    })
        .catch((e) => {
            res.status(500);
            return res.json({message:"Fehler, User konnte nicht erstellt werden"});
        });

});
*/

app.post("/login", async (req, res) => {
    const payload = req.body;
    const sessionId = await authService.login(payload.username, payload.password);
    if (!sessionId) {
        res.status(401);
        return res.json({message: "Bad email or password"});
    }
    res.cookie("session", sessionId, {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
    });
    res.json({status: "ok"});
});


app.use(
    (
        err: HttpError,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        // format error
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        });
    }
);

app.listen(port, () => {
    console.log(`Expenses app listening at http://localhost:${port}`);
});