import {Express} from "express";
import {authRouter} from "./auth.route";
import {managementRouter} from "./management.route";
import {accessRouter} from "./access.route";
import {statsRouter} from "./stats.route";
import {passRouter} from "./pass.route";
import {areaRouter} from "./area.route";
import {animalRouter} from "./animal.route";
import {authMiddleware} from "../middlewares/auth.middleware";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/management", authMiddleware, managementRouter);
    app.use("/access", accessRouter);
    app.use("/stats", statsRouter);
    app.use("/pass", passRouter);
    app.use("/area", areaRouter);
    app.use("/animal", animalRouter);
}
