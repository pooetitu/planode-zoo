import express from "express";
import {EmployeeController} from "../controllers/employee.controller";
import {EmployeeType} from "../models/employee.model";

export async function maintenanceMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers["authorization"];
    if (token !== undefined) {
        const employeeController = await EmployeeController.getInstance();
        const employee = await employeeController.getEmployeeByToken(token);
        if (employee !== null && employee.type === EmployeeType.ADMIN) {
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

export async function treatmentMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers["authorization"];
    if (token !== undefined) {
        const employeeController = await EmployeeController.getInstance();
        const employee = await employeeController.getEmployeeByToken(token);
        if (employee !== null && employee.type === EmployeeType.VETERINARY) {
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
