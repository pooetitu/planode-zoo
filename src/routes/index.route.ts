import {Express} from "express";
import {authRouter} from "./auth.route";
import {managementRouter} from "./management.route";
import {accessRouter} from "./access.route";
import {statsRouter} from "./stats.route";
import {passRouter} from "./pass.route";
import {areaRouter} from "./area.route";
import {animalRouter} from "./animal.route";
import {managementMiddleware} from "../middlewares/management.middleware";
import {EmployeeType} from "../models/employee.model";
import {ensureLoggedIn} from "connect-ensure-login";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/management", ensureLoggedIn(), managementRouter);
    app.use("/access", accessRouter);
    app.use("/stats", statsRouter);
    app.use("/pass", ensureLoggedIn(), passRouter);
    app.use("/area", areaRouter);
    app.use("/animal", ensureLoggedIn(), managementMiddleware(EmployeeType.ADMIN), animalRouter);
}
