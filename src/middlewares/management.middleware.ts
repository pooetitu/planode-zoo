import express from "express";
import {EmployeeController} from "../controllers/employee.controller";
import {EmployeeType} from "../models/employee.model";

export function managementMiddleware(type: EmployeeType): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
    return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const token = req.headers["authorization"];
        if (token !== undefined) {
            const employeeController = await EmployeeController.getInstance();
            const employee = await employeeController.getEmployeeByToken(token);
            if (employee !== null && employee.type === type) {
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
}