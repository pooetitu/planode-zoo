import express from "express";
import {AuthController} from "../controllers/auth.controller";

export async function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers["authorization"];
    console.log(token);
    if (token !== undefined) {
        const authController = await AuthController.getInstance();
        const session = await authController.getSession(token);
        if (session !== null) {
            next();
            return;
        } else {
            res.status(403).end();
            return;
        }
    } else {
        res.status(401).end();
        return;
    }
}
