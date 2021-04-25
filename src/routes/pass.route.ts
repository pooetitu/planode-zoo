import express from "express";
import {PassController} from "../controllers/pass.controller";
import {managementMiddleware} from "../middlewares/management.middleware";
import {EmployeeType} from "../models/employee.model";
import {User} from "../models/user.model";

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
 *         isEscapeGame: false
 *         startDate: 2021-05-14
 *         type: DAILY
 *         orderedAreaIds: [ "1cf385e6-3c6f-4b2d-8aba-d66b264f1c4e","224f0a01-dc36-4ae6-bbdd-3910ea04e47b","99b11bb7-9b95-4e7e-a306-2ad67af93256"]
 */

/**
 * @swagger
 * /pass/:
 *  post:
 *      security:
 *          - ApiKeyAuth: []
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
passRouter.post("/", async function (req, res) {
    const passController = await PassController.getInstance();
    const user = (req.user as User);
    if (!user || req.body.areaIds === undefined || req.body.areaIds.length <= 0) {
        res.status(400).end();
        return;
    }
    try {
        const pass = await passController.createPass({...req.body}, user);
        res.json(pass);
    } catch (err) {
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
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
passRouter.get("/", async function (req, res) {
    const passController = await PassController.getInstance();
    try {
        const pass = await passController.getAllPass((req.user as User).id);
        res.json(pass);
    } catch (err) {
        res.status(400).send(err).end();
    }
});

/**
 * @swagger
 * /pass/{passId}:
 *  get:
 *      summary: Get a specific Pass by ID
 *      tags: [Pass]
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
passRouter.get("/:passId", async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    try {
        const pass = await passController.getPassByIdForUser(passId, (req.user as User).id);
        res.json(pass);
    } catch (err) {
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
    try {
        await passController.updatePass(passId, {...req.body});
        res.status(204).end();
    } catch (err) {
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
passRouter.delete("/:passId", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const passId = req.params.passId;
    const passController = await PassController.getInstance();
    try {
        const pass = await passController.deletePassById(passId);
        res.json(pass);
    } catch (err) {
        res.status(400).send(err).end();
    }
});

export {
    passRouter
};
