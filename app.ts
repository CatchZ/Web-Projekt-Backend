import express, {Request} from "express";
import cookieParser from "cookie-parser";
import ReiseService from "./services/ReiseService";
import {HttpError} from "express-openapi-validator/dist/framework/types";
import AuthService from "./services/AuthService";
import {knex as knexDriver} from "knex";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./knexfile";
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');


const app = express();
const port = process.env.PORT || 3000;

const knex = knexDriver(config);
const reiseService = new ReiseService(knex);
const authService = new AuthService();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "wad2122@outlook.de",
        pass: "neuesKennwort1"
    }
});
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(bodyParser.json());

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
        return res.json({message: "Du must angemeldet sein, um diese Seite zu sehen."});
    }
    const email = await authService.getUserInSession(session);
    if (!email) {
        res.status(401);
        return res.json({message: "Du must angemeldet sein, um diese Seite zu sehen."});
    }
    req.userEmail = email;
    next();
};

app.get("/journeys", checkLogin, async (req, res) => {
    const session = req.cookies.session;
    const email = await authService.getUserInSession(session);
    reiseService.getAll(email).then((total) => res.send(total));
});

app.post("/journeys", checkLogin, async (req, res) => {
    const payload = req.body;
    const session = req.cookies.session;
    const email = await authService.getUserInSession(session);
    //reiseService.add(payload, email).then((newEntry) => res.send(newEntry));
});

app.delete("/journeys/:id", checkLogin, async (req, res) => {
    const id = req.params.reiseid;
    reiseService.delete(id).then(() => {
        res.status(204);
        return res.json({message: "Reise gel??scht!"});
    });
});

app.post("/journeys/:id", checkLogin, async (req, res) => {
    const id = req.params.reiseid;
    const payload = req.body;
    const session = req.cookies.session;
    const email = await authService.getUserInSession(session);
    //put?
    reiseService.delete(id).then(() => {
        reiseService.add(payload, email).then(() => {
            res.status(204);
            return res.json({message: "Reise aktualisiert"});
        })
    });
});

app.post("/login", async (req, res) => {
    const payload = req.body;
    const sessionId = await authService.login(payload.username, payload.password);
    if (!sessionId) {
        res.status(401);
        return res.json({message: "Email oder Passwort falsch"});
    }
    res.cookie("session", sessionId, {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
    });
    res.json({status: "ok"});
});

//fuer anzeigen logged in user
app.get("/loggedInUser", checkLogin, async (req, res) => {
    const session = req.cookies.session;
    const email = await authService.getUserInSession(session);
    return res.json({"email": email});
});

app.delete("/logout", async (req, res) => {
    /*vllt geht auch so:
     res.cookie("session", sessionId, {
        expires: Date.now()
        httpOnly: false,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
    });
    res.json({status: "ok"});
       */
    const session = req.cookies.session;
    res.clearCookie(session);
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
    console.log(`Reisen-reisen l??uft auf http://localhost:${port}`);
});


/*REGISTRIERUNG*/
app.post("/sendRegistrationMail", async (req, res) => {
    var errormsg = "";
    const payload = req.body;
    await authService.create({email: payload.username as string, password: payload.password as string}).then(async () => {
        const options = {
            from: "wad2122@outlook.de",
            to: payload.username, // hier wahrscheinlich falsch??
            subject: "Empf??ngertest",
            text: "yay "
        };
        await transporter.sendMail(options, function (err: any, info: { response: string; }) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Sent:" + info.response);
        });
        return res.json({message: "Mail sent"});
    })
        .catch((e) => {
            res.status(500);
            return res.json({message: errormsg});
        });
});
/*
    const transporter = nodemailer.createTransport( {
        service: "hotmail",
        auth: {
            user: "wad2122@outlook.de",
            pass: "hunter2aberrueckwaert"
        }
    });
    const options = {
        from: "wad2122@outlook.de",
        to: mailData.email, //irgendwas hier wahrscheinlich falsch??
        subject: "Empf??ngertest",
        text: "yay "
    };
    transporter.sendMail(options, function (err: any, info: { response: string; }) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Sent:" + info.response);
    });
});
 */