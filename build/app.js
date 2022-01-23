"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ReiseService_1 = __importDefault(require("./services/ReiseService"));
const AuthService_1 = __importDefault(require("./services/AuthService"));
const knex_1 = require("knex");
const cors_1 = __importDefault(require("cors"));
const knexfile_1 = __importDefault(require("./knexfile"));
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const body_parser_1 = __importDefault(require("body-parser"));
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-express-middleware');
const app = (0, express_1.default)();
i18next.use(Backend).use(i18nextMiddleware.LanguageDetector)
    .init({
    fallbackLng: 'de',
    backend: {
        loadPath: './locales/{{lng}}/translation.json'
    }
});
app.use(i18nextMiddleware.handle(i18next));
const port = process.env.PORT || 3000;
//const {t} = useTranslation();
const knex = (0, knex_1.knex)(knexfile_1.default);
const reiseService = new ReiseService_1.default(knex);
const authService = new AuthService_1.default();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "wad2122@outlook.de",
        pass: "hunter2aberrueckwaert"
    }
});
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get('/', async (req, res) => {
    res.send({ headers: req.headers });
});
const checkLogin = async (req, res, next) => {
    const session = req.cookies.session;
    if (!session) {
        res.status(401);
        return res.json({ message: "Du must angemeldet sein, um diese Seite zu sehen." });
    }
    const email = await authService.getUserInSession(session);
    if (!email) {
        res.status(401);
        return res.json({ message: "Du must angemeldet sein, um diese Seite zu sehen." });
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
        return res.json({ message: "Reise gelöscht!" });
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
            return res.json({ message: "Reise aktualisiert" });
        });
    });
});
app.post("/login", async (req, res) => {
    const payload = req.body;
    const sessionId = await authService.login(payload.username, payload.password);
    if (!sessionId) {
        res.status(401);
        return res.json({ message: "Email oder Passwort falsch" });
    }
    res.cookie("session", sessionId, {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
    });
    res.json({ status: "ok" });
});
//fuer anzeigen logged in user
app.get("/loggedInUser", checkLogin, async (req, res) => {
    const session = req.cookies.session;
    const email = await authService.getUserInSession(session);
    return res.json({ "email": email });
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
app.use(OpenApiValidator.middleware({
    apiSpec: "./openapi.yaml",
    validateRequests: true,
    validateResponses: false,
}));
app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});
app.listen(port, () => {
    console.log(`Reisen-reisen läuft auf http://localhost:${port}`);
});
/*REGISTRIERUNG*/
app.post("/sendRegistrationMail", async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "wad2122@outlook.de",
            pass: "hunter2aberrueckwaert"
        }
    });
    const options = {
        from: "wad2122@outlook.de",
        to: "carolinatrack@googlemail.com",
        subject: "Test",
        text: "Klappt "
    };
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Sent:" + info.response);
        res.status(200);
    });
});
/*
app.post("/sendRegistrationMail", async (req, res) => {
    var errormsg = "";
   // var validationCode = crypto.randomUUID().toString();
    const mailData = req.body;
    await authService.create({email: mailData.username as string, password: mailData.password as string}).then(async () => {
        const options = {
            from: "wad2122@outlook.de",
            to: "carolinatrack@gmail.com", // hier wahrscheinlich falsch??
            subject: "Empfängertest",
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

 */
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
        subject: "Empfängertest",
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
