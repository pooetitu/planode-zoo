import {Express} from "express";
import {authRouter} from "./auth.route";
import {managementRouter} from "./management.route";
import {accessRouter} from "./access.route";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/management", managementRouter);
    app.use("/access", accessRouter);
}
