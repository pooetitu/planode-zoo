import {NextFunction, Request, Response} from "express";
import {EmployeeType} from "../models/employee.model";

export function managementMiddleware(type: EmployeeType): (req: Request, res: Response, next: NextFunction) => void {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const employee = req.body.user.employee;
            console.log(employee)
            if (employee !== null && employee.type === type) {
                next();
                return;
            } else {
                res.status(401).end();
                return;
            }
        } catch (err) {
            res.status(401).end();
            return;
        }
    }
}
