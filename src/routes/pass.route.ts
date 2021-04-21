import express from "express";
import {PassController} from "../controllers/pass.controller";
import {authMiddleware} from "../middlewares/auth.middleware";

const passRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pass
 *   description: Pass actions
 */

passRouter.post("/", authMiddleware, async function (req, res) {
    const passController = await PassController.getInstance();
    const type = req.body.type;
    const startDate = req.body.startDate;
    const isEscapeGame = req.body.isEscapeGame;
    const orderedAreaIds = req.body.orderedAreaIds;
    const user = req.body.user;

    if (user === null) {
        res.status(400).end();
        return;
    }

    const pass = await passController.createPass({
        type,
        startDate: new Date(startDate),
        isEscapeGame,
        orderedAreaIds
    }, user);
    if (pass === null) {
        res.status(400).end();
        return;
    } else {
        res.json(pass);
    }
});

passRouter.get("/", async function (req, res) {
    const passController = await PassController.getInstance();
    const pass = await passController.getAllPass();
    if (pass === null) {
        res.status(400).end();
        return;
    } else {
        res.json(pass);
    }
});

passRouter.get("/:passId", async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    const pass = await passController.getPassById(passId);
    if (pass === null) {
        res.status(400).end();
        return;
    } else {
        res.json(pass);
    }
});

passRouter.put("/:passId", async function (req, res) {

});

passRouter.delete("/:passId", async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    const pass = await passController.deletePassById(passId);
    if (pass === null) {
        res.status(400).end();
        return;
    } else {
        res.json(pass);
    }
});

export {
    passRouter
};
