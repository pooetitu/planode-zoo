import express from "express";
import {PassController} from "../controllers/pass.controller";
import {authMiddleware} from "../middlewares/auth.middleware";
import {managementMiddleware} from "../middlewares/management.middleware";
import {EmployeeType} from "../models/employee.model";

const passRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pass
 *   description: Pass actions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pass:
 *       type: object
 *       required:
 *         - passId
 *       properties:
 *         passId:
 *           type: number
 *           description: The auto-generated id of the Pass
 *       example:
 *         id: 1564
 */

/**
 * @swagger
 * /pass/:
 *  post:
 *      summary: Manage Authentification
 *      tags: [Pass]
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
passRouter.post("/", authMiddleware, async function (req, res) {
    const passController = await PassController.getInstance();
    const user = req.body.user;
    if (!user || req.body.areaIds === undefined || req.body.areaIds.length <= 0) {
        res.status(400).end();
        return;
    }
    try {
        const pass = await passController.createPass({...req.body}, user);
        res.json(pass);
    }catch (err) {
        res.status(400).send(err).end();
    }
});

/**
 * @swagger
 * /pass/:
 *  get:
 *      summary: Manage Authentification
 *      tags: [Pass]
 *      responses:
 *        200:
 *          description: The Access Result
 *        404:
 *          description: The Access was not found
 */
passRouter.get("/", authMiddleware, async function (req, res) {
    const passController = await PassController.getInstance();
    try{
        const pass = await passController.getAllPass(req.body.user.id);
        res.json(pass);
    }
    catch (err) {
        res.status(400).send(err).end();
    }
});

/**
 * @swagger
 * /pass/{passId}:
 *  get:
 *      summary: Manage Authentification
 *      tags: [Pass]
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
passRouter.get("/:passId", authMiddleware, async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    try{
        const pass = await passController.getPassByIdForUser(passId, req.body.user.id);
        res.json(pass);
    }catch (err) {
        res.status(400).send(err).end();
    }
});

/**
 * @swagger
 * /pass/{passId}:
 *  put:
 *      summary: Manage Authentification
 *      tags: [Pass]
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
passRouter.put("/:passId", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    if (passId === undefined) {
        res.status(400).end();
        return;
    }
    try{
        await passController.updatePass(passId, {...req.body});
        res.status(204).end();
    }catch (err) {
        res.status(400).send(err).end()
    }
});

/**
 * @swagger
 * /pass/{passId}:
 *  delete:
 *      summary: Manage Authentification
 *      tags: [Pass]
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
passRouter.delete("/:passId",async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    try{
        const pass = await passController.deletePassById(passId);
        res.json(pass);
    }catch (err) {
        res.status(400).send(err).end();
    }
});

export {
    passRouter
};
