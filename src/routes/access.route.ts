import express from "express";
import {AccessController} from "../controllers/access.controller";
import {areaAccessMiddleware, zooAccessMiddleware, zooOpenCheckMiddleware} from "../middlewares/access.middleware";
import {PassController} from "../controllers/pass.controller";
import {AreaController} from "../controllers/area.controller";

const accessRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Access
 *   description: Access rules for a Pass
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Access:
 *       type: object
 *       required:
 *         - passId
 *         - areaId
 *       properties:
 *         passId:
 *           type: number
 *           description: The ID of the Pass
 *         areaId:
 *           type: number
 *           description: The ID of the Area
 *       example:
 *         passId: 4
 *         areaId: 8
 */

/**
 * @swagger
 * /access/zoo/{passId}:
 *  get:
 *      summary: Return if the pass has the permission to be in the Zoo
 *      tags: [Access]
 *      parameters:
 *      - in: path
 *        name: passId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The Pass Id
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
accessRouter.get("/zoo/:passId", zooOpenCheckMiddleware(new Date(Date.now())), zooAccessMiddleware, async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    const pass = await passController.getPassById(passId);
    if (pass === null) {
        res.status(400).end();
        return;
    }
    const accessController = await AccessController.getInstance();
    try {
        const passUsage = await accessController.accessZoo(pass);
        res.status(200).json(passUsage);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

/**
 * @swagger
 * /access/zoo/{areaId}/{passId}:
 *  get:
 *      summary: Return access of the pass
 *      tags: [Access]
 *      parameters:
 *      - in: path
 *        name: passId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The Pass Id
 *      - in: path
 *        name: areaId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The Area Id
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
accessRouter.get("/area/:areaId/:passId", zooAccessMiddleware, areaAccessMiddleware, async function (req, res) {
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
    try {
        const areaAccess = await accessController.accessArea(pass, area);
        res.status(201).json(areaAccess);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

/**
 * @swagger
 * /access/zoo/{passId}:
 *  put:
 *      summary: Update access of the pass
 *      tags: [Access]
 *      parameters:
 *      - in: path
 *        name: passId
 *        schema :
 *          type: integer
 *          required: true
 *          description: The Pass Id
 *      responses:
 *        200:
 *          description: The Access Result
 *        404:
 *          description: The Access was not found
 */
accessRouter.put("/zoo/:passId", zooOpenCheckMiddleware(new Date()), zooAccessMiddleware, async function (req, res) {
    const passId = req.params.passId;
    if (passId === undefined) {
        res.status(400).end();
        return;
    }
    const accessController = await AccessController.getInstance();
    try {
        await accessController.leaveZoo(passId);
        res.status(204).end();
    } catch (err) {
        res.status(409).send(err).end();
    }
});

export {
    accessRouter
};
