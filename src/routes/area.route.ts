import express from "express";
import {AreaController} from "../controllers/area.controller";
import {AnimalController} from "../controllers/animal.controller";
import {managementMiddleware} from "../middlewares/management.middleware";
import {EmployeeType} from "../models/employee.model";
import {ensureLoggedIn} from "connect-ensure-login";

const areaRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Area
 *   description: Area actions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       required:
 *         - areaId
 *         - name
 *         - type
 *         - description
 *         - capacity
 *         - duration
 *         - openingTime
 *         - disabledAccess
 *       properties:
 *         areaId:
 *           type: number
 *           description: The auto-generated id of the Area
 *         name:
 *           type: string
 *           description: The name of the Area
 *         type:
 *           type: string
 *           description: The type of the Area
 *         description:
 *           type: string
 *           description: The description of the Area
 *         capacity:
 *           type: number
 *           description: The capacity of the Area
 *         duration:
 *           type: number
 *           description: The duration of the Area
 *         openingTime:
 *           type: Date
 *           description: The opening time of the Area
 *         disabledAccess:
 *           type: boolean
 *           description: To know if an area is open or closed
 *       example:
 *         id: 1564
 *         name: Place des lions
 *         type: Area classique
 *         description: La place des lions
 *         capacity: 6
 *         duration: 15
 *         openingTime: 21/04/2021
 *         disabledAccess: 1
 */

/**
 * @swagger
 * /area/{areaId}/{passId}:
 *  post:
 *      summary: Create an area
 *      tags: [Area]
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
areaRouter.post("/", ensureLoggedIn(), managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaController = await AreaController.getInstance();
    try {
        const area = await areaController.createArea({...req.body});
        res.status(201).json(area);
    } catch (err) {
        res.status(400).send(err).end();
        return;
    }
});

/**
 * @swagger
 * /area/{areaId}/{passId}:
 *  get:
 *      summary: Create an area
 *      tags: [Area]
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
areaRouter.get("/:areaId", async function (req, res) {
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    try {
        const area = await areaController.getAreaById(areaId);
        res.json(area);
    } catch (err) {
        res.status(400).send(err).end();
    }
});

areaRouter.get("/", async function (req, res) {
    const areaController = await AreaController.getInstance();
    const area = await areaController.getAll();
    if (area === null) {
        res.status(400).end();
        return;
    } else {
        res.json(area);
    }
});

/**
 * @swagger
 * /area/{areaId}/{passId}:
 *  put:
 *      summary: Create an area
 *      tags: [Area]
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
areaRouter.put("/:areaId", ensureLoggedIn(), managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    if (areaId === undefined) {
        res.status(400).end();
        return;
    }
    try {
        await areaController.updateArea(areaId, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

areaRouter.put("/:areaId/:animalId", ensureLoggedIn(), managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaId = req.params.areaId;
    const animalId = req.params.animalId;
    const areaController = await AreaController.getInstance();
    const area = await areaController.getAreaById(areaId);
    if (area === null) {
        res.status(400).end();
        return;
    }
    const animalController = await AnimalController.getInstance();
    const animal = await animalController.getAnimal(animalId);
    if (animal === null) {
        res.status(400).end();
        return;
    }
    await areaController.addAnimal(area, animal);
    res.status(204).end();
});

/**
 * @swagger
 * /area/zoo/{areaId}/{passId}:
 *  delete:
 *      summary: Create an area
 *      tags: [Area]
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
areaRouter.delete("/:areaId", ensureLoggedIn(), managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    const area = await areaController.deleteAreaById(areaId);
    if (area) {
        res.status(400).end();
        return;
    } else {
        res.status(204).send("Deleted area").end();
    }
});

export {
    areaRouter
};

