"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//import AuthService from "./services/AuthService";
const knex_1 = require("knex");
const cors_1 = __importDefault(require("cors"));
const knexfile_1 = __importDefault(require("./knexfile"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const knex = (0, knex_1.knex)(knexfile_1.default);
//const reiseService = new ReiseService(knex);
//const authService = new AuthService();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
/*
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

app.get("/expenses", checkLogin, async (req, res) => {
    const session = req.cookies.session;
    const email = await authService.getUserEmailForSession(session);
    //reiseService.getAll(email).then((total) => res.send(total));
});


app.post("/reisen", checkLogin, async (req, res) => {
    const payload = req.body;
    const session = req.cookies.session;
    const email = await authService.getUserEmailForSession(session);
    //reiseService.add(payload, email).then((newEntry) => res.send(newEntry));
});

app.delete("/reisen/:reiseid", checkLogin, async (req, res) => {
    const id = req.params.reiseid;
    reiseService.delete(id).then(() => {
        res.status(204);
        return res.json({message:"Reise wurde gelöscht!"});
    });
});
app.post("/reisen/:reiseid", checkLogin, async (req, res) => {
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

app.post("/login", async (req, res) => {
    const payload = req.body;
    const sessionId = await authService.login(payload.email, payload.password);
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


 */
app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});
app.listen(port, () => {
    console.log(`Expenses app listening at http://localhost:${port}`);
});
