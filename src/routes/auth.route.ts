import express from "express";
import {AuthController} from "../controllers/auth.controller";
import {authMiddleware} from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/signup", async function (req, res) {
    const login = req.body.login;
    const password = req.body.password;
    const email = req.body.email;
    if (login === undefined ||
        password === undefined ||
        email === undefined) {
        res.status(400).end();
        return;
    }
    const authController = await AuthController.getInstance();
    const user = await authController.subscribe({
        login,
        password,
        email
    });
    if (user !== null) {
        res.status(201);
        res.json(user);
    } else {
        res.status(409).end();
    }
});

authRouter.post("/login", async function (req, res) {
    const login = req.body.login;
    const password = req.body.password;
    if (login === undefined || password === undefined) {
        res.status(400).end();
        return;
    }
    const authController = await AuthController.getInstance();
    const session = await authController.login(login, password);
    if (session === null) {
        res.status(404).end();
        return;
    } else {
        res.json({
            token: session.token
        });
    }
});

authRouter.delete("/logout", authMiddleware, async function (req, res) {
    const token = req.headers["authorization"] as string;
    const authController = await AuthController.getInstance();
    await authController.logout(token);
    res.send("sup la session");
});

export {
    authRouter
};
