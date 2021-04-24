import express from "express";
import {AuthController} from "../controllers/auth.controller";

export async function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers["authorization"];
    if (token !== undefined) {
        try{
            const authController = await AuthController.getInstance();
            const session = await authController.getSession(token);
            req.body.user = await session.user;
            next();
        }catch (err) {
            res.status(403).send(err);
        }
    } else {
        res.status(401).send("No token found");
        return;
    }
}
