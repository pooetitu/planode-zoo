import {NextFunction, Request, Response} from "express";
import {EmployeeType} from "../models/employee.model";
import {User} from "../models/user.model";

export function managementMiddleware(type: EmployeeType): (req: Request, res: Response, next: NextFunction) => void {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const employee = (req.user as User).employee;
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
