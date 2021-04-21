import express from "express";
import {AuthController} from "../controllers/auth.controller";

export async function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers["authorization"];
    if (token !== undefined) {
        const authController = await AuthController.getInstance();
        const session = await authController.getSession(token);
        if (session !== null) {
            req.body.user = await session?.getUser();
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
