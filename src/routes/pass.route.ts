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
    if (user === null || req.body.areaIds === undefined || req.body.areaIds.length <= 0) {
        res.status(400).end();
        return;
    }
    const pass = await passController.createPass({...req.body}, user);
    if (pass === null) {
        res.status(400).end();
        return;
    } else {
        res.json(pass);
    }
});

/**
 * @swagger
 * /pass/:
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
passRouter.put("/:passId", async function (req, res) {

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
