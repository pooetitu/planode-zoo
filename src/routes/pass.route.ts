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
 *   description: All actions for the pass
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pass:
 *       type: object
 *       required:
 *         - isEscapeGame
 *         - startDate
 *         - type
 *         - orderedAreaIds
 *       properties:
 *         isEscapeGame:
 *           type: boolean
 *           description: Know if the pass is an Escape Game Pass
 *         startDate:
 *           type: date
 *           description: Start date of the pass
 *         type:
 *           type: string
 *           description: The type of the pass (YEARLY, WEEKLY, MONTHLY)
 *         orderedAreaIds:
 *           type: array
 *           items:
 *              type: string
 *           description: The order of the area for the pass
 *       example:
 *         isEscapeGame: 1
 *         startDate: 2021-05-14
 *         type: WEEK_END
 *         orderedAreaIds: ["1","2","3"]
 */

/**
 * @swagger
 * /pass/:
 *  post:
 *      summary: Create a new Pass
 *      tags: [Pass]
 *      requestBody:
 *        description: Data of the pass
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Pass'
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Pass'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
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
 *      summary: Get all Pass for the User
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
 *      summary: Get a specific Pass by ID
 *      tags: [Pass]
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Pass'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
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
 *      summary: Update a Pass
 *      tags: [Pass]
 *      parameters:
 *      - in: path
 *        name: passId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The Pass ID
 *      requestBody:
 *        description: Data of the pass
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Pass'
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Pass'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        404:
 *          description: A pass with the specified ID was not found.
 *        5XX:
 *          description: Unexpected error.
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
 *      summary: Delete a specific Pass
 *      tags: [Pass]
 *      parameters:
 *      - in: path
 *        name: passId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The Pass ID
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        404:
 *          description: A pass with the specified ID was not found.
 *        5XX:
 *          description: Unexpected error.
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
