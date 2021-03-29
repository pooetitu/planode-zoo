import {Express} from "express";
import {authRouter} from "./auth.route";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
}