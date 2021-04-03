import express from "express";
import {AccessController} from "../controllers/access.controller";
import {zooAccessMiddleware, zooOpenCheckMiddleware} from "../middlewares/access.middleware";
import {PassController} from "../controllers/pass.controller";

const accessRouter = express.Router();

accessRouter.get("/zoo/:passId", zooOpenCheckMiddleware(new Date()), zooAccessMiddleware, async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    const pass = await passController.getPassById(passId);
    if (pass === null) {
        res.status(400).end();
        return;
    }
    const accessController = await AccessController.getInstance();
    const passUsage = await accessController.usePass(pass);
    if (passUsage !== null) {
        res.status(201);
        res.json(passUsage);
    } else {
        res.status(409).end();
    }
});

export {
    accessRouter
};