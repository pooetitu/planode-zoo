import express from "express";
import {AccessController} from "../controllers/access.controller";
import {PassController} from "../controllers/pass.controller";

export function zooOpenCheckMiddleware(accessDate: Date): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
    return function (req: express.Request, res: express.Response, next: express.NextFunction) {
        if (accessDate !== undefined) {
            AccessController.getInstance()
                .then(accessController => (accessController.zooCanOpen(accessDate)
                    .then(canOpen => canOpen ? next() : res.status(403).end())));
        } else {
            res.status(401).end();
            return;
        }
    }
}

export async function zooAccessMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    const pass = await passController.getPassById(passId);
    if (pass !== null) {
        const accessController = await AccessController.getInstance();
        if (await accessController.canAccessZoo(pass)) {
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
