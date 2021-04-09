import express from "express";
import {AccessController} from "../controllers/access.controller";
import {zooAccessMiddleware, zooOpenCheckMiddleware} from "../middlewares/access.middleware";
import {PassController} from "../controllers/pass.controller";
import {AreaController} from "../controllers/area.controller";

const accessRouter = express.Router();

/**
 * @swagger
 * /access/zoo/{passId}:
 *  get:
 *      summary: Get access of the pass
 *      tags: [Access]
 *      parameters:
 *          - in: path
 *            name: passId
 *            schema :
 *              type: integer
 *            required: true
 *            description: The Pass Id
 *      responses:
 *          200:
 *              description: The Access Result
 *              contens:
 *                  application/json:
 *                      schema:
 *                          $ref:'#/components/schemas/Access'
 *          404:
 *              description: The Access was not found
 */
accessRouter.get("/zoo/:passId", zooOpenCheckMiddleware(new Date()), zooAccessMiddleware, async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    const pass = await passController.getPassById(passId);
    if (pass === null) {
        res.status(400).end();
        return;
    }
    const accessController = await AccessController.getInstance();
    const passUsage = await accessController.accessZoo(pass);
    if (passUsage !== null) {
        res.status(201);
        res.json(passUsage);
    } else {
        res.status(409).end();
    }
});

accessRouter.put("/zoo/:passId", zooOpenCheckMiddleware(new Date()), zooAccessMiddleware, async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    const pass = await passController.getPassById(passId);
    if (pass === null) {
        res.status(400).end();
        return;
    }
    const accessController = await AccessController.getInstance();
    const deleted = await accessController.leaveZoo(pass);
    if (deleted !== null) {
        res.status(204).end();
    } else {
        res.status(409).end();
    }
});

accessRouter.get("/area/:areaId/:passId", zooAccessMiddleware, async function (req, res) {
    const passId = req.params.passId;
    const areaId = req.params.areaId;
    const passController = await PassController.getInstance();
    const areaController = await AreaController.getInstance();
    const pass = await passController.getPassById(passId);
    const area = await areaController.getAreaById(areaId);
    if (pass === null || area === null) {
        res.status(400).end();
        return;
    }
    const accessController = await AccessController.getInstance();
    const areaAccess = await accessController.accessArea(pass, area);
    if (areaAccess !== null) {
        res.status(201);
        res.json(areaAccess);
    } else {
        res.status(409).end();
    }
});

export {
    accessRouter
};